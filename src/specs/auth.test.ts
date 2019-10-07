import JtockAuth from "../index";
import mockAxios from "jest-mock-axios";

import signUpSuccess from "./__mocks__/signup_200.json";

const auth = new JtockAuth({
  host: "http://127.0.0.1:3000",
  prefixUrl: "/api/v1"
});

describe("New user", () => {
  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
  });
  it("To be able to sign up", () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    auth
      .signUp(
        {
          email: "john-doe@js.com",
          password: "azerty",
          avatarUrl: "www.image.com/picture.jpg"
        },
        "www.url-after-confirmation.com"
      )
      .then(thenFn)
      .catch(catchFn);
    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/auth",
      {
        avatarUrl: "www.image.com/picture.jpg",
        email: "john-doe@js.com",
        password: "azerty"
      },
      { params: { confirm_success_url: "www.url-after-confirmation.com" } }
    );
    mockAxios.mockResponse(signUpSuccess);
    // expect(thenFn).toHaveBeenCalledTimes(1);
    expect(catchFn).not.toHaveBeenCalled();
  });
});

const customStringify = function(v: object) {
  const cache = new Set();
  return JSON.stringify(v, function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        // Circular reference found
        try {
          // If this value does not reference a parent it can be deduped
          return JSON.parse(JSON.stringify(value));
        } catch (err) {
          // discard key if value cannot be deduped
          return;
        }
      }
      // Store value in our set
      cache.add(value);
    }
    return value;
  });
};
