import Axios from "axios";
import {
  JtockAuthOptions,
  DeviseHeader,
  authenticateRouteOptions
} from "./@types/options";

class JtockAuth {
  options: JtockAuthOptions;
  debug: boolean;
  apiUrl: string;
  apiAuthUrl: string;
  emailField: string;
  passwordField: string;
  session: DeviseHeader | undefined;
  signInUrl: string;
  signOutUrl: string;
  validateTokenUrl: string;
  constructor(options: JtockAuthOptions) {
    this.options = options;
    this.debug = options.debug ? options.debug : false;
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
  }

  test() {
    Axios.get(this.signInUrl)
      .then(response => {
        console.log("Connexion success");
      })
      .catch(error => {
        if (error.response) {
          console.log("Connexion success");
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
        reject("Error on signUp");
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
        resolve(validateResponse);
      } catch (err) {
        this.debugIfActive(err.response);
        reject("error on signin");
      }
    });
  }

  signOut() {
    if (!this.session) throw "No active session";

    return new Promise(async (resolve, reject) => {
      try {
        const logOutResponse = await Axios.delete(this.signOutUrl, {
          headers: { ...this.session }
        });
        this.debugIfActive(logOutResponse);
        resolve(logOutResponse.data);
      } catch (err) {
        this.debugIfActive(err.response);
        reject("error on signout");
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
        reject("error on signout");
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
        reject("error when validate token");
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
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation
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
        reject("error on signin");
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
        reject("Error on signUp");
      }
    });
  }

  updatePasswordByToken(token: string, redirectUrl: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const updatePassword = await Axios.get(`${this.apiAuthUrl}/password`, {
          params: { reset_password_token: token, redirect_url: redirectUrl }
        });
        this.debugIfActive(updatePassword);
        resolve(updatePassword);
      } catch (err) {
        this.debugIfActive(err.response);
        reject("Error on signUp");
      }
    });
  }

  authenticateRoute(url: string, options: authenticateRouteOptions = {}) {
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
          }
        });
        this.debugIfActive(reponse);
        this.setSession(reponse.headers);
        resolve(reponse);
      } catch (err) {
        this.debugIfActive(err.response);
        reject("Error on authenticateRoute");
      }
    });
  }

  private debugIfActive(...arg: any) {
    if (this.debug) {
      console.log(...arg);
    }
  }

  private setSession(headers: DeviseHeader) {
    if (!this.session) {
      return (this.session = headers);
    }
    this.session = {
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
  }
}

export default JtockAuth;
