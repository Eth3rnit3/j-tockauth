"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class JtockAuth {
    constructor(options) {
        this.options = options;
        this.debug = options.debug ? options.debug : false;
        this.apiUrl = `${options.host}${options.prefixUrl ? options.prefixUrl : ""}${options.authUrl ? options.authUrl : "/auth"}`;
        this.emailField = options.emailField ? options.emailField : "email";
        this.passwordField = options.passwordField
            ? options.passwordField
            : "password";
        // urls
        this.signInUrl = `${this.apiUrl}${this.options.authUrl ? this.options.authUrl.signIn : "/sign_in"}`;
        this.signOutUrl = `${this.apiUrl}${this.options.authUrl ? this.options.authUrl.signIn : "/sign_out"}`;
        this.validateTokenUrl = `${this.apiUrl}${this.options.authUrl
            ? this.options.authUrl.validateToken
            : "/validate_token"}`;
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
                const signUpResponse = await axios_1.default.post(this.apiUrl, {
                    ...userFields
                }, { params: { confirm_success_url: confirmSuccessUrl } });
                this.debugIfActive(signUpResponse);
                this.setSession(signUpResponse.headers);
                resolve(signUpResponse);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject("Error on signUp");
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
                resolve(validateResponse);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject("error on signin");
            }
        });
    }
    signOut() {
        if (!this.session)
            throw "No active session";
        return new Promise(async (resolve, reject) => {
            try {
                const logOutResponse = await axios_1.default.delete(this.signOutUrl, {
                    headers: { ...this.session }
                });
                this.debugIfActive(logOutResponse);
                resolve(logOutResponse.data);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject("error on signout");
            }
        });
    }
    deleteResource() {
        if (!this.session)
            throw "No active session";
        return new Promise(async (resolve, reject) => {
            try {
                const logOutResponse = await axios_1.default.delete(this.apiUrl, {
                    headers: { ...this.session }
                });
                this.debugIfActive(logOutResponse);
                resolve(logOutResponse.data);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject("error on signout");
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
                reject("error when validate token");
            }
        });
    }
    changePassword(oldPassword, newPassword, newPasswordConfirmation) {
        return new Promise(async (resolve, reject) => {
            try {
                const changePasswordResponse = await axios_1.default.put(`${this.apiUrl}`, {
                    current_password: oldPassword,
                    new_password: newPassword,
                    new_password_confirmation: newPasswordConfirmation
                }, {
                    headers: { ...this.session }
                });
                this.debugIfActive(changePasswordResponse);
                this.setSession(changePasswordResponse.headers);
                resolve(changePasswordResponse);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject("error on signin");
            }
        });
    }
    resetPassword(email, redirectUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const resetPasswordResponse = await axios_1.default.post(`${this.apiUrl}/password`, { email, redirect_url: redirectUrl });
                this.debugIfActive(resetPasswordResponse);
                resolve(resetPasswordResponse);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject("Error on signUp");
            }
        });
    }
    updatePasswordByToken(token, redirectUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const updatePassword = await axios_1.default.get(`${this.apiUrl}/password`, {
                    params: { reset_password_token: token, redirect_url: redirectUrl }
                });
                this.debugIfActive(updatePassword);
                resolve(updatePassword);
            }
            catch (err) {
                this.debugIfActive(err.response);
                reject("Error on signUp");
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
exports.default = JtockAuth;
