import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const SignUpPage = () => {
  const [disabled, setDisabled] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  useEffect(() => {
    if (password.length > 0 && passwordRepeat.length > 0) {
      if (password === passwordRepeat) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      setDisabled(true);
    }
  }, [password, passwordRepeat]);

  const submitForm = (e) => {
    e.preventDefault();
    const body = {
      username,
      email,
      password,
    };
    axios.post("/api/1.0/users", body);
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordRepeat("");
  };

  return (
    <>
      <form>
        <h1>Sign Up</h1>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="password repeat">Password Repeat</label>
        <input
          type="password"
          value={passwordRepeat}
          id="password repeat"
          onChange={(e) => setPasswordRepeat(e.target.value)}
        />
        <button disabled={disabled} onClick={(e) => submitForm(e)}>
          Sign Up
        </button>
      </form>
    </>
  );
};

export default SignUpPage;
