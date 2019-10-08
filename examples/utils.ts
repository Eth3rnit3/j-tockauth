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
