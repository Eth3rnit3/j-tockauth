export interface JtockAuthOptions {
  host: string; //          ex: http://api.domain.com || https://api.domain.com
  prefixUrl?: string; //    ex: /api/v1
  authUrl?: JtockAuthUrls;
  emailField?: string; //       default: 'email'
  passwordField?: string; //    default: 'password'
  debug?: boolean; //    default: false
}

export interface JtockAuthUrls {
  base: string; //          default: /auth
  signIn: string; //        default: /sign_in
  signOut: string; //       default: /sign_out
  validateToken: string; // default: /validate_token
}

export interface DeviseHeader {
  "access-token": string;
  "cache-control": string;
  client: string;
  "content-type": string;
  expiry: string;
  "token-type": string;
  uid: string;
}
