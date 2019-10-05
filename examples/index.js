"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
// Devise Token Auth update the token on each controller or every 7 seconds
// In this example, 3 requests are made with 3 different token
// Login user
utils_1.signIn();
// GET /users 10sec after login
setTimeout(() => {
    utils_1.getUsers();
}, 7500);
// GET /users/2 20sec after login
setTimeout(() => {
    utils_1.getUserById(2);
}, 15000);
// GET /users/2 20sec after login
setTimeout(() => {
    utils_1.signOut();
}, 16000);
