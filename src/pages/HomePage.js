import React from "react";
import UserList from "../components/UserList";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  let navigate = useNavigate();

  return (
    <div data-testid="home-page">
      <UserList navigate={navigate} />
    </div>
  );
};

export default HomePage;
