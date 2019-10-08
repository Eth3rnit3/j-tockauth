import JTockAuth from "../src";

export const auth = new JTockAuth({
  host: "http://127.0.0.1:3000",
  prefixUrl: "/api/v1",
  debug: false
});

export const signIn = () => {
  auth
    .signIn("john-doe_1@gmail.com", "azerty1234")
    .then(userData => {
      console.log("User connexion successfull !");
    })
    .catch(error => {
      console.error("User connexion error !");
    });
};
export const signOut = () => {
  auth
    .signOut()
    .then(response => {
      console.log("User unconnexion successfull !");
    })
    .catch(error => {
      console.error("User unconnexion error !");
    });
};

export const resetPassword = () => {
  auth
    .resetPassword("john-doe_1@gmail.com", "http://redirect-url.com")
    .then(response => {
      console.log("Reset password successfull !");
    })
    .catch(error => {
      console.error("Reset password error !");
    });
};

export const updatePasswordByToken = () => {
  auth
    .updatePasswordByToken("4owCHzAQXPNPTGPv__1K", "https://google.fr")
    .then(response => {
      console.log("Update password successfull !", customStringify(response));
    })
    .catch(error => {
      console.error("Update password error !", error);
    });
};

export const getUsers = () => {
  auth
    .authenticateRoute("/users", {
      method: "get"
    })
    .then(response => {
      console.log("GET /users successfull !");
    })
    .catch(error => {
      console.error("GET /users error !");
    });
};

export const getUserById = id => {
  auth
    .authenticateRoute(`/users/${id}`, {
      method: "get"
    })
    .then(response => {
      console.log("GET /users/:id successfull !");
    })
    .catch(error => {
      console.error("GET /users/:id error !");
    });
};

const customStringify = function(v) {
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
