"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const index_1 = __importDefault(require("../index"));
const signup_200_json_1 = __importDefault(require("./__mocks__/signup_200.json"));
const signin_200_json_1 = __importDefault(require("./__mocks__/signin_200.json"));
const validate_200_json_1 = __importDefault(require("./__mocks__/validate_200.json"));
const reset_password_200_json_1 = __importDefault(require("./__mocks__/reset_password_200.json"));
const reset_password_by_token_200_json_1 = __importDefault(require("./__mocks__/reset_password_by_token_200.json"));
const private_users_200_json_1 = __importDefault(require("./__mocks__/private_users_200.json"));
const mock = new axios_mock_adapter_1.default(axios_1.default);
const auth = new index_1.default({
    host: "http://127.0.0.1:3000",
    prefixUrl: "/api/v1",
    debug: false
});
describe("New user", () => {
    beforeEach(() => {
        mock.reset();
    });
    it("To be able to sign up", async () => {
        mock.onPost("http://127.0.0.1:3000/api/v1/auth").reply(200, signup_200_json_1.default);
        const res = await auth.signUp({
            email: "john-doe@js.com",
            password: "azerty",
            avatarUrl: "www.image.com/picture.jpg"
        }, "www.url-after-confirmation.com");
        expect(res.data.data.data.email).toBe("john-doe@js.com");
    });
    // Need to find a solution for token validation because headers was present in
    // response but undefined in valiidateToken function
    xit("To be able to sign in", async () => {
        mock
            .onPost("http://127.0.0.1:3000/api/v1/auth/sign_in")
            .reply(200, signin_200_json_1.default);
        mock
            .onGet("http://127.0.0.1:3000/api/v1/auth/validate_token")
            .reply(200, validate_200_json_1.default);
        const res = await auth.signIn("john-doe_1@gmail.com", "azerty1234");
        expect(res.data.data.data.email).toBe("john-doe_1@gmail.com");
    });
    it("To be able to reset password", async () => {
        mock
            .onPost("http://127.0.0.1:3000/api/v1/auth/password")
            .reply(200, reset_password_200_json_1.default);
        const res = await auth.resetPassword("john-doe_1@gmail.com", "/reset-form");
        expect(res.data.data.message).toBe("An email has been sent to 'john-doe_1@gmail.com' containing instructions for resetting your password.");
    });
    it("To be able to reset password by token and redirected", async () => {
        mock
            .onGet("http://127.0.0.1:3000/api/v1/auth/password/edit")
            .reply(200, reset_password_by_token_200_json_1.default);
        const res = await auth.updatePasswordByToken("iLaKZn4K0F_plkgXxSCUnw", "/url-to-redirect");
        expect(res.data.data.message).toBe("You have been redirected !");
    });
    it("To be able to get restricted route", async () => {
        mock.onGet("http://127.0.0.1:3000/api/v1/users").reply(200, private_users_200_json_1.default);
        const res = await auth.authenticateRoute("/users", {
            method: "get"
        });
        expect(res.data.data.users.length).toBeGreaterThan(1);
    });
});
