import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AccountActivationPage from "./pages/AccountActivationPage";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector";
import logo from "./assets/hoax.png";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/" title="Home">
            <img src={logo} alt="hoax" width="60" />
            Hoax
          </Link>
          <ul className="navbar-nav">
            <Link className="navbar-brand" to="/signup">
              {t("signUp")}
            </Link>
            <Link className="navbar-brand" to="/login">
              Login
            </Link>
          </ul>
        </div>
      </nav>

      <div className="container pt-3">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/activate/:token" element={<AccountActivationPage />} />
        </Routes>
        <LanguageSelector />
      </div>
    </Router>
  );
}

export default App;
