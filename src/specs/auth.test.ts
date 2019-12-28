import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import JtockAuth from "../index";
import signUpSuccess from "./__mocks__/signup_200.json";
import signInSuccess from "./__mocks__/signin_200.json";
import validateSuccess from "./__mocks__/validate_200.json";
import resetPasswordSuccess from "./__mocks__/reset_password_200.json";
import resetPasswordByTokenSuccess from "./__mocks__/reset_password_by_token_200.json";
import privateUsers from "./__mocks__/private_users_200.json";

const mock = new MockAdapter(axios);

const auth = new JtockAuth({
  host: "http://127.0.0.1:3000",
  prefixUrl: "/api/v1",
  debug: false
});

describe("New user", () => {
  beforeEach(() => {
    mock.reset();
  });
  it("To be able to sign up", async () => {
    mock.onPost("http://127.0.0.1:3000/api/v1/auth").reply(200, signUpSuccess);
    const res: any = await auth.signUp(
      {
        email: "john-doe@js.com",
        password: "azerty",
        avatarUrl: "www.image.com/picture.jpg"
      },
      "www.url-after-confirmation.com"
    );
    expect(res.data.data.data.email).toBe("john-doe@js.com");
  });

  // Need to find a solution for token validation because headers was present in
  // response but undefined in valiidateToken function
  xit("To be able to sign in", async () => {
    mock
      .onPost("http://127.0.0.1:3000/api/v1/auth/sign_in")
      .reply(200, signInSuccess);
    mock
      .onGet("http://127.0.0.1:3000/api/v1/auth/validate_token")
      .reply(200, validateSuccess);
    const res: any = await auth.signIn("john-doe_1@gmail.com", "azerty1234");
    expect(res.data.data.data.email).toBe("john-doe_1@gmail.com");
  });

  it("To be able to reset password", async () => {
    mock
      .onPost("http://127.0.0.1:3000/api/v1/auth/password")
      .reply(200, resetPasswordSuccess);
    const res: any = await auth.resetPassword(
      "john-doe_1@gmail.com",
      "/reset-form"
    );
    expect(res.data.data.message).toBe(
      "An email has been sent to 'john-doe_1@gmail.com' containing instructions for resetting your password."
    );
  });

  it("To be able to reset password by token and redirected", async () => {
    mock
      .onGet("http://127.0.0.1:3000/api/v1/auth/password/edit")
      .reply(200, resetPasswordByTokenSuccess);
    const res: any = await auth.updatePasswordByToken(
      "iLaKZn4K0F_plkgXxSCUnw",
      "/url-to-redirect"
    );
    expect(res.data.data.message).toBe("You have been redirected !");
  });

  it("To be able to get restricted route", async () => {
    mock.onGet("http://127.0.0.1:3000/api/v1/users").reply(200, privateUsers);
    const res: any = await auth.privateRoute("/users", {
      method: "get"
    });
    expect(res.data.data.users.length).toBeGreaterThan(1);
  });
});
