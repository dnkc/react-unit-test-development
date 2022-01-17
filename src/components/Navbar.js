import React from "react";
import logo from "../assets/hoax.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../state/AuthContextWrapper";
import { useContext } from "react";

const Navbar = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/" title="Home">
          <img src={logo} alt="hoax" width="60" />
          Hoax
        </Link>
        <ul className="navbar-nav">
          {!auth.isLoggedIn && (
            <>
              <Link className="navbar-brand" to="/signup">
                {t("signUp")}
              </Link>
              <Link className="navbar-brand" to="/login">
                {t("login")}
              </Link>
            </>
          )}
          {auth.isLoggedIn && (
            <Link className="navbar-brand" to={`/user/${auth.id}`}>
              My Profile
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
