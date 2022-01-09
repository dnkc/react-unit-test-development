import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const SignUpPage = () => {
  const [disabled, setDisabled] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [apiProgress, setApiProgress] = useState(false);
  const [signupSuccess, setSignUpSuccess] = useState(false);

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

  const submitForm = async (e) => {
    e.preventDefault();
    const body = {
      username,
      email,
      password,
    };
    setApiProgress(true);
    try {
      await axios.post("/api/1.0/users", body).then(() => {
        setSignUpSuccess(true);
      });
    } catch (error) {}
    // fetch("/api/1.0/users", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // });
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordRepeat("");
    setApiProgress(false);
  };

  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
      {!signupSuccess && (
        <form className="card mt-5" data-testid="form-sign-up">
          <div className="card-header">
            <h1 className="text-center">Sign Up</h1>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password repeat">Password Repeat</label>
              <input
                type="password"
                value={passwordRepeat}
                className="form-control"
                id="password repeat"
                onChange={(e) => setPasswordRepeat(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button
                className="btn btn-primary"
                disabled={disabled || apiProgress}
                onClick={(e) => submitForm(e)}
              >
                {apiProgress && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                )}
                Sign Up
              </button>
            </div>
          </div>
        </form>
      )}
      {signupSuccess && (
        <div className="alert alert-success mt-3">
          Please check your e-mail to activate your account.
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
