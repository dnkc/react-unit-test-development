import React from "react";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { login } from "../api/apiCalls";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../state/AuthContextWrapper";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [apiProgress, setApiProgress] = useState(false);
  const [failedMessage, setFailedMessage] = useState();

  const auth = useContext(AuthContext);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setButtonDisabled(!(email && password));
  }, [email, password]);

  const submitForm = async (e) => {
    e.preventDefault();
    setApiProgress(true);
    try {
      const response = await login({ email, password });

      auth.onLoginSuccess({ isLoggedIn: true, id: response.data.id });

      navigate("/");
    } catch (error) {
      setFailedMessage(error.response.data.message);
    }
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
              <h1 className="text-center">{t("login")}</h1>
            </div>
            <div className="card-body">
              <Input
                id="email"
                label={t("email")}
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFailedMessage();
                }}
                help={errors.email}
              />
              <Input
                id="password"
                label={t("password")}
                value={password}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFailedMessage();
                }}
                help={errors.password}
              />
              {failedMessage && <Alert type="danger">{failedMessage}</Alert>}
              <div className="text-center">
                <Button
                  disabled={buttonDisabled}
                  apiProgress={apiProgress}
                  onClick={(e) => submitForm(e)}
                >
                  {t("login")}
                </Button>
              </div>
            </div>
          </form>
        }
      </div>
    </>
  );
};

export default LoginPage;
