"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
// Devise Token Auth update the token on each controller or every 7 seconds
// In this example, 3 requests are made with 3 different token
// Login user
utils_1.updatePasswordByToken();
// // GET /users 7.5sec after login
// setTimeout(() => {
//   getUsers();
// }, 7500);
// // GET /users/2 15sec after login
// setTimeout(() => {
//   getUserById(2);
// }, 15000);
// // GET /users/2 16sec after login
// setTimeout(() => {
//   signOut();
// }, 16000);
// // Reset password
// setTimeout(() => {
//   resetPassword();
// }, 20000);
