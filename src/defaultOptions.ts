import { JtockAuthOptions } from "./@types/options";
const defaultOptions: JtockAuthOptions = {
  host: "",
  prefixUrl: "",
  authUrl: {
    base: "auth",
    signIn: "/sign_in",
    signOut: "/sign_out"
  }
};

export default defaultOptions;
