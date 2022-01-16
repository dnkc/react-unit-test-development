import React from "react";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import { useState, useEffect } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email, password]);

  return (
    <>
      <div
        className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
        data-testid="login-page"
      >
        {
          <form className="card mt-5">
            <div className="card-header">
              <h1 className="text-center">Login</h1>
            </div>
            <div className="card-body">
              <Input
                id="email"
                label="E-mail"
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

              <div className="text-center">
                <button
                  disabled
                  className="btn btn-primary"
                  disabled={buttonDisabled}
                  //onClick={(e) => submitForm(e)}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        }
      </div>
    </>
  );
};

export default LoginPage;
