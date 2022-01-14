import axios from "axios";
import { currentLanguage } from "../locale/i18n";
import cors from "cors";

export const signUp = (body) => {
  return axios.post("http://localhost:8080/api/1.0/users", body, {
    headers: {
      "Accept-Language": currentLanguage(),
    },
  });
};

export const activate = (token) => {
  return axios.post(
    `http://localhost:8080/api/1.0/users/token/${token}`,
    { mode: cors },
    {
      headers: {
        "Accept-Language": currentLanguage(),
      },
    }
  );
};

export const loadUsers = (page) => {
  return axios.get("http://localhost:8080/api/1.0/users", {
    params: { page, size: 3 },
    headers: {
      "Accept-Language": currentLanguage(),
    },
  });
};
