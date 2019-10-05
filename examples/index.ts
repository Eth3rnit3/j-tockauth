import { signIn, signOut, getUsers, getUserById } from "./utils";

// Devise Token Auth update the token on each controller or every 7 seconds
// In this example, 3 requests are made with 3 different token

// Login user
signIn();

// GET /users 10sec after login
setTimeout(() => {
  getUsers();
}, 7500);

// GET /users/2 20sec after login
setTimeout(() => {
  getUserById(2);
}, 15000);

// GET /users/2 20sec after login
setTimeout(() => {
  signOut();
}, 16000);
