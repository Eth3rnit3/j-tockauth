/// <reference types="typescript" />
import { JtockAuthOptions, DeviseHeader } from "../options";

export as namespace JtockAuth;
declare class JtockAuth {
  constructor(options: JtockAuthOptions);
  options: JtockAuthOptions;
  debug: boolean;
  apiUrl: string;
  emailField: string;
  passwordField: string;
  signInUrl: string;
  signOutUrl: string;
  validateTokenUrl: string;

  test(): Promise<any>;
  tokenHeaders(): any;
  signIn(email: string, password: string): Promise<any>;
  signOut(): Promise<any>;
  validateToken(headers: DeviseHeader): Promise<any>;
}
export default JtockAuth;
