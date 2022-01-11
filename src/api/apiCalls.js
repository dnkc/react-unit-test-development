import axios from "axios";
import { currentLanguage } from "../locale/i18n";

export const signUp = (body) => {
  return axios.post("/api/1.0/users", body, {
    headers: {
      "Accept-Language": currentLanguage(),
    },
  });
};
