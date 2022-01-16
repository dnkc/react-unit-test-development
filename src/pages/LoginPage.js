import React from "react";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import { useState, useEffect } from "react";
import { login } from "../api/apiCalls";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [apiProgress, setApiProgress] = useState(false);

  useEffect(() => {
    setButtonDisabled(!(email && password));
  }, [email, password]);

  const submitForm = async (e) => {
    e.preventDefault();
    setApiProgress(true);
    try {
      await login({ email, password });
    } catch (error) {}
    setApiProgress(false);
  };

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
                  disabled={buttonDisabled || apiProgress}
                  onClick={(e) => submitForm(e)}
                >
                  {apiProgress && <Spinner />}
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
