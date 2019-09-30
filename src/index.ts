import Axios from "axios";
import { JtockAuthOptions } from "./declarations/options";

class JtockAuth {
  options: JtockAuthOptions;
  apiUrl: string;
  constructor(options: JtockAuthOptions) {
    this.options = options;
    this.apiUrl = `${options.host}${
      options.prefixUrl ? options.prefixUrl : ""
    }`;
  }

  test() {
    Axios.get(this.apiUrl)
      .then(response => {
        console.log("Connexion success", response);
      })
      .catch(error => {
        console.log("Connexion error", error);
      });
  }
}

export default JtockAuth;
