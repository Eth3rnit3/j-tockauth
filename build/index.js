"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const storageKey = "J-tockAuth-Storage";
const storageRoleKey = "J-tockAuth-roles";
class JtockAuth {
    constructor(options) {
        this.debug = options.debug ? options.debug : false;
        this.roles = options.useRoles ? [] : undefined;
        this.options = options;
        this.apiUrl = `${options.host}${options.prefixUrl ? options.prefixUrl : ""}`;
        this.apiAuthUrl = `${this.apiUrl}${options.authUrl ? options.authUrl : "/auth"}`;
        this.emailField = options.emailField ? options.emailField : "email";
        this.passwordField = options.passwordField
            ? options.passwordField
            : "password";
        // urls
        this.signInUrl = `${this.apiAuthUrl}${this.options.authUrl ? this.options.authUrl.signIn : "/sign_in"}`;
        this.signOutUrl = `${this.apiAuthUrl}${this.options.authUrl ? this.options.authUrl.signIn : "/sign_out"}`;
        this.validateTokenUrl = `${this.apiAuthUrl}${this.options.authUrl
            ? this.options.authUrl.validateToken
            : "/validate_token"}`;
        this.setLastSession();
        axios_1.default.interceptors.response.use(function (response) {
            if (Array.isArray(response.data)) {
                return {
                    ...response,
                    total: response.data.length
                };
            }
            return response;
        }, function (error) {
            return Promise.reject(error);
        });
    }
    test() {
        axios_1.default.get(this.signInUrl)
            .then(response => {
            console.log("Connexion success");
        })
            .catch(error => {
            if (error.response) {
                console.log("Connexion success");
            }
            else {
                console.log("Connexion errror");
            }
        });
    }
    tokenHeaders() {
        return this.session;
    }
    signUp(userFields, confirmSuccessUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const signUpResponse = await axios_1.default.post(this.apiAuthUrl, {
                    ...userFields
                }, { params: { confirm_success_url: confirmSuccessUrl } });
                this.debugIfActive(signUpResponse);
                this.setSession(signUpResponse.headers);
                resolve(signUpResponse);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject(err);
            }
        });
    }
    signIn(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const signInResponse = await axios_1.default.post(this.signInUrl, {
                    [this.emailField]: email,
                    [this.passwordField]: password
                });
                this.debugIfActive(signInResponse);
                this.setSession(signInResponse.headers);
                const validateResponse = await this.validateToken(signInResponse.headers);
                //@ts-ignore
                this.setRoles(validateResponse);
                resolve(validateResponse);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject(err);
            }
        });
    }
    signOut() {
        if (!this.session)
            throw "No active session";
        return new Promise(async (resolve, reject) => {
            try {
                localStorage.removeItem(storageKey);
                const logOutResponse = await axios_1.default.delete(this.signOutUrl, {
                    headers: { ...this.session }
                });
                this.session = undefined;
                this.debugIfActive(logOutResponse);
                resolve(logOutResponse.data);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject(err);
            }
        });
    }
    deleteResource() {
        if (!this.session)
            throw "No active session";
        return new Promise(async (resolve, reject) => {
            try {
                const logOutResponse = await axios_1.default.delete(this.apiAuthUrl, {
                    headers: { ...this.session }
                });
                this.debugIfActive(logOutResponse);
                resolve(logOutResponse.data);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject(err);
            }
        });
    }
    validateToken(headers) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios_1.default.get(this.validateTokenUrl, {
                    params: {
                        uid: headers.uid,
                        client: headers.client,
                        "access-token": headers["access-token"]
                    }
                });
                this.setSession(response.headers);
                resolve(response.data);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject(err);
            }
        });
    }
    changePassword(oldPassword, newPassword, newPasswordConfirmation) {
        return new Promise(async (resolve, reject) => {
            try {
                const changePasswordResponse = await axios_1.default.put(`${this.apiAuthUrl}`, {
                    current_password: oldPassword,
                    password: newPassword,
                    password_confirmation: newPasswordConfirmation
                }, {
                    headers: { ...this.session }
                });
                this.debugIfActive(changePasswordResponse);
                this.setSession(changePasswordResponse.headers);
                resolve(changePasswordResponse);
            }
            catch (err) {
                this.debugIfActive(err.response);
                if (err.response.headers['access-token']) {
                    this.setSession(err.response.headers);
                }
                reject(err);
            }
        });
    }
    resetPassword(email, redirectUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const resetPasswordResponse = await axios_1.default.post(`${this.apiAuthUrl}/password`, { email, redirect_url: redirectUrl });
                this.debugIfActive(resetPasswordResponse);
                resolve(resetPasswordResponse);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject(err);
            }
        });
    }
    updatePasswordByToken(token, redirectUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const updatePassword = await axios_1.default.get(`${this.apiAuthUrl}/password/edit`, {
                    params: { reset_password_token: token, redirect_url: redirectUrl }
                });
                this.debugIfActive(updatePassword);
                resolve(updatePassword);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject(err);
            }
        });
    }
    authenticateRoute(url, options = {}) {
        if (url[0] === "/") {
            url = `${this.apiUrl}${url}`;
        }
        return new Promise(async (resolve, reject) => {
            try {
                const reponse = await axios_1.default({
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
            }
            catch (err) {
                this.debugIfActive(err.response);
                if (err.response.headers['access-token']) {
                    this.setSession(err.response.headers);
                }
                reject(err);
            }
        });
    }
    debugIfActive(...arg) {
        if (this.debug) {
            console.log(...arg);
        }
    }
    setSession(headers) {
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
    setLastSession() {
        const lastSession = localStorage.getItem(storageKey);
        const lastRoles = localStorage.getItem(storageRoleKey);
        if (lastSession) {
            const headers = JSON.parse(lastSession);
            this.setSession(headers);
        }
        if (lastRoles) {
            this.roles = JSON.parse(lastRoles);
        }
    }
    setRoles(response) {
        if (this.options.useRoles) {
            this.roles = response && response.data ? response.data.roles : [];
            localStorage.setItem(storageRoleKey, JSON.stringify(this.roles));
        }
    }
}
exports.default = JtockAuth;
