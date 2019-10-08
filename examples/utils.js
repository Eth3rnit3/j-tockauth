"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
exports.auth = new src_1.default({
    host: "http://127.0.0.1:3000",
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
exports.resetPassword = () => {
    exports.auth
        .resetPassword("john-doe_1@gmail.com", "http://redirect-url.com")
        .then(response => {
        console.log("Reset password successfull !");
    })
        .catch(error => {
        console.error("Reset password error !");
    });
};
exports.updatePasswordByToken = () => {
    exports.auth
        .updatePasswordByToken("4owCHzAQXPNPTGPv__1K", "https://google.fr")
        .then(response => {
        console.log("Update password successfull !", customStringify(response));
    })
        .catch(error => {
        console.error("Update password error !", error);
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
const customStringify = function (v) {
    const cache = new Set();
    return JSON.stringify(v, function (key, value) {
        if (typeof value === "object" && value !== null) {
            if (cache.has(value)) {
                // Circular reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                }
                catch (err) {
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
