import axios from "axios";
import { currentLanguage } from "../locale/i18n";
import cors from "cors";

export const signUp = (body) => {
  return axios.post("/api/1.0/users", body, {
    headers: {
      "Accept-Language": currentLanguage(),
    },
  });
};

export const activate = (token) => {
  return axios.post(
    `/api/1.0/users/token/${token}`,
    { mode: cors },
    {
      headers: {
        "Accept-Language": currentLanguage(),
      },
    }
  );
};

export const loadUsers = (page) => {
  return axios.get("/api/1.0/users", {
    params: { page, size: 3 },
    headers: {
      "Accept-Language": currentLanguage(),
    },
  });
};

export const getUserById = (id) => {
  return axios.get(`/api/1.0/users/${id}`);
};

export const login = (body) => {
  return axios.post("/api/1.0/auth", body);
};
