import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import JtockAuth from "../index";
import signUpSuccess from "./__mocks__/signup_200.json";
import signInSuccess from "./__mocks__/signin_200.json";
import validateSuccess from "./__mocks__/validate_200.json";

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
});
