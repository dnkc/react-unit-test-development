import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input";
import { act } from "react-dom/test-utils";

const SignUpPage = () => {
  const [disabled, setDisabled] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [apiProgress, setApiProgress] = useState(false);
  const [signupSuccess, setSignUpSuccess] = useState(false);
  const [errors, setErrors] = useState({});

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
    if (errors.username && username.length > 0) {
      setErrors((errors.username = {}));
    }
    if (errors.email && email.length > 0) {
      setErrors((errors.email = {}));
    }
    if (errors.password && password.length > 0) {
      setErrors((errors.password = {}));
    }
  }, [username, email, password, passwordRepeat]);

  const setInitialState = () => {
    act(() => {
      setUsername("");
      setEmail("");
      setPassword("");
      setPasswordRepeat("");
      setApiProgress(false);
    });
  };

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
        act(() => {
          setSignUpSuccess(true);
        });
      });
    } catch (error) {
      if (error.response.status === 400) {
        setErrors(error.response.data.validationErrors);
      }
      setApiProgress(false);
    }
    // fetch("/api/1.0/users", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // });
    setInitialState();
  };

  let passwordMismatch =
    passwordRepeat.length > 0 && password !== passwordRepeat
      ? "Password mismatch"
      : "";
  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
      {!signupSuccess && (
        <form className="card mt-5" data-testid="form-sign-up">
          <div className="card-header">
            <h1 className="text-center">Sign Up</h1>
          </div>
          <div className="card-body">
            <Input
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              help={errors.username}
            />
            <Input
              id="email"
              label="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              help={errors.email}
            />
            <Input
              id="password"
              label="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              help={errors.password}
            />
            <Input
              id="password repeat"
              label="Password Repeat"
              type="password"
              value={passwordRepeat}
              help={passwordMismatch}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
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
