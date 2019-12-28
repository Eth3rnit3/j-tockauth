import Axios, { AxiosResponse } from "axios";
import {
  JtockAuthOptions,
  DeviseHeader,
  privateRouteOptions
} from "./@types/options";

const storageKey = "J-tockAuth-Storage";
const storageRoleKey = "J-tockAuth-roles";

const defaultOptions: JtockAuthOptions = {
  host: 'http://127.0.0.1:3000',
  mode: 'local',
  debug: false,
  useRoles: false
}

class JtockAuth {
  options: JtockAuthOptions;
  apiUrl: string;
  apiAuthUrl: string;
  emailField: string;
  passwordField: string;
  session: DeviseHeader | undefined;
  signInUrl: string;
  signOutUrl: string;
  validateTokenUrl: string;
  roles: Array<any> | undefined;
  constructor(options: JtockAuthOptions) {
    this.options = { ...defaultOptions, ...options };
    this.roles = options.useRoles ? [] : undefined;
    this.apiUrl = `${options.host}${
      options.prefixUrl ? options.prefixUrl : ""
    }`;
    this.apiAuthUrl = `${this.apiUrl}${
      options.authUrl ? options.authUrl : "/auth"
    }`;
    this.emailField = options.emailField ? options.emailField : "email";
    this.passwordField = options.passwordField
      ? options.passwordField
      : "password";
    // urls
    this.signInUrl = `${this.apiAuthUrl}${
      this.options.authUrl ? this.options.authUrl.signIn : "/sign_in"
    }`;
    this.signOutUrl = `${this.apiAuthUrl}${
      this.options.authUrl ? this.options.authUrl.signIn : "/sign_out"
    }`;
    this.validateTokenUrl = `${this.apiAuthUrl}${
      this.options.authUrl
        ? this.options.authUrl.validateToken
        : "/validate_token"
    }`;

    this.setLastSession();

    Axios.interceptors.response.use(function (response) {
      if (Array.isArray(response.data)){
        return {
          ...response,
          total: response.data.length
        }
      }
      return response;
    }, function (error) {
      return Promise.reject(error);
    });
  }

  test() {
    Axios.get(this.signInUrl)
      .then(response => {
        console.log("Connexion success");
      })
      .catch(error => {
        if (error.response) {
          console.log("Connexion success");
          this.debugIfActive("J-TockAuth Config", this)
        } else {
          console.log("Connexion errror");
        }
      });
  }

  tokenHeaders() {
    return this.session;
  }

  signUp(userFields: any, confirmSuccessUrl: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const signUpResponse = await Axios.post(
          this.apiAuthUrl,
          {
            ...userFields
          },
          { params: { confirm_success_url: confirmSuccessUrl } }
        );
        this.debugIfActive(signUpResponse);
        this.setSession(signUpResponse.headers);
        resolve(signUpResponse);
      } catch (err) {
        this.debugIfActive(err.response);
        reject(err);
      }
    });
  }

  signIn(email: string, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const signInResponse = await Axios.post(this.signInUrl, {
          [this.emailField]: email,
          [this.passwordField]: password
        });
        this.debugIfActive(signInResponse);
        this.setSession(signInResponse.headers);
        const validateResponse = await this.validateToken(
          signInResponse.headers
        );
        //@ts-ignore
        this.setRoles(validateResponse)
        resolve(validateResponse);
      } catch (err) {
        this.debugIfActive(err.response);
        reject(err);
      }
    });
  }

  signOut() {
    if (!this.session) throw "No active session";

    return new Promise(async (resolve, reject) => {
      try {
        localStorage.removeItem(storageKey);
        const logOutResponse = await Axios.delete(this.signOutUrl, {
          headers: { ...this.session }
        });
        this.session = undefined;
        this.debugIfActive(logOutResponse);
        resolve(logOutResponse.data);
      } catch (err) {
        this.debugIfActive(err.response);
        reject(err);
      }
    });
  }

  deleteResource() {
    if (!this.session) throw "No active session";

    return new Promise(async (resolve, reject) => {
      try {
        const logOutResponse = await Axios.delete(this.apiAuthUrl, {
          headers: { ...this.session }
        });
        this.debugIfActive(logOutResponse);
        resolve(logOutResponse.data);
      } catch (err) {
        this.debugIfActive(err.response);
        reject(err);
      }
    });
  }

  validateToken(headers: DeviseHeader) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.get(this.validateTokenUrl, {
          params: {
            uid: headers.uid,
            client: headers.client,
            "access-token": headers["access-token"]
          }
        });
        this.setSession(response.headers);
        resolve(response.data);
      } catch (err) {
        this.debugIfActive(err.response);
        reject(err);
      }
    });
  }

  changePassword(
    oldPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const changePasswordResponse = await Axios.put(
          `${this.apiAuthUrl}`,
          {
            current_password: oldPassword,
            password: newPassword,
            password_confirmation: newPasswordConfirmation
          },
          {
            headers: { ...this.session }
          }
        );
        this.debugIfActive(changePasswordResponse);
        this.setSession(changePasswordResponse.headers);
        resolve(changePasswordResponse);
      } catch (err) {
        this.debugIfActive(err.response);
        if (err.response.headers['access-token']){
          this.setSession(err.response.headers);
        }
        reject(err);
      }
    });
  }

  resetPassword(email: string, redirectUrl: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const resetPasswordResponse = await Axios.post(
          `${this.apiAuthUrl}/password`,
          { email, redirect_url: redirectUrl }
        );
        this.debugIfActive(resetPasswordResponse);
        resolve(resetPasswordResponse);
      } catch (err) {
        this.debugIfActive(err.response);
        reject(err);
      }
    });
  }

  updatePasswordByToken(token: string, redirectUrl: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const updatePassword = await Axios.get(
          `${this.apiAuthUrl}/password/edit`,
          {
            params: { reset_password_token: token, redirect_url: redirectUrl }
          }
        );
        this.debugIfActive(updatePassword);
        resolve(updatePassword);
      } catch (err) {
        this.debugIfActive(err.response);
        reject(err);
      }
    });
  }

  privateRoute(url: string, options: privateRouteOptions = {}) {
    if (url[0] === "/") {
      url = `${this.apiUrl}${url}`;
    }
    return new Promise(async (resolve, reject) => {
      try {
        const reponse = await Axios({
          url,
          method: options.method,
          data: options.data,
          headers: {
            ...options.headers,
            ...this.session
          },
        });
        this.debugIfActive(reponse);
        this.setSession(reponse.headers);
        resolve(reponse);
      } catch (err) {
        this.debugIfActive(err.response);
        if (err.response.headers['access-token']){
          this.setSession(err.response.headers);
        }
        reject(err);
      }
    });
  }

  private debugIfActive(...arg: any) {
    if (this.options.debug) {
      console.log(...arg);
    }
  }

  private setSession(headers: DeviseHeader) {
    if (!this.session) {
      return (this.session = headers);
    }
    const session = {
      ["access-token"]: headers["access-token"]
        ? headers["access-token"]
        : this.session["access-token"],
      ["cache-control"]: headers["cache-control"]
        ? headers["cache-control"]
        : this.session["cache-control"],
      client: headers.client ? headers.client : this.session.client,
      ["content-type"]: headers["content-type"]
        ? headers["content-type"]
        : this.session["content-type"],
      expiry: headers.expiry ? headers.expiry : this.session.expiry,
      ["token-type"]: headers["token-type"]
        ? headers["token-type"]
        : this.session["token-type"],
      uid: headers.uid ? headers.uid : this.session.uid
    };
    this.session = { ...session };
    localStorage.setItem(storageKey, JSON.stringify(session));
  }

  private setLastSession() {
    if(this.options.mode === 'local'){
      this.setLastLocalSession();
    }
    if(this.options.useRoles){
      this.setLastRoles()
    }
    
  }

  private setLastLocalSession() {
    const lastSession = localStorage.getItem(storageKey);
    if (lastSession) {
      const headers: DeviseHeader = JSON.parse(lastSession);
      this.setSession(headers);
    }
  }

  private setRoles(response: AxiosResponse<any>) {
    if(this.options.useRoles){
      this.roles = response && response.data ? response.data.roles : []
      localStorage.setItem(storageRoleKey, JSON.stringify(this.roles))
    }
  }

  private setLastRoles() {
    const lastRoles = localStorage.getItem(storageRoleKey);
    if (lastRoles) {
      this.roles = JSON.parse(lastRoles)
    }
  }
}

export default JtockAuth;
