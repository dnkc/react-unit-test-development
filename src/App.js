import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AccountActivationPage from "./pages/AccountActivationPage";
import Navbar from "./components/Navbar";
import LanguageSelector from "./components/LanguageSelector";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      {" "}
      <Navbar />
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
    </>
  );
}

export default App;
