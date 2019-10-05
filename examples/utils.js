"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
exports.auth = new src_1.default({
    host: "https://evening-beach-51109.herokuapp.com",
    prefixUrl: "/api/v1",
    debug: false
});
exports.signIn = () => {
    exports.auth
        .signIn("john-doe_1@gmail.com", "azerty1234")
        .then(userData => {
        console.log("User connexion successfull !");
    })
        .catch(error => {
        console.error("User connexion error !");
    });
};
exports.signOut = () => {
    exports.auth
        .signOut()
        .then(response => {
        console.log("User unconnexion successfull !");
    })
        .catch(error => {
        console.error("User unconnexion error !");
    });
};
exports.getUsers = () => {
    exports.auth
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
exports.getUserById = id => {
    exports.auth
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
