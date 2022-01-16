import React from "react";
// import { useNavigate } from "react-router-dom";
import defaultProfileImage from "../assets/profile.png";

const UserListItem = (props) => {
  //let navigate = useNavigate();
  const { user, navigate } = props;

  return (
    <li
      className="list-group-item list-group-item-action"
      onClick={() => navigate(`/user/${user.id}`)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={defaultProfileImage}
        alt="profile"
        width="20"
        className="rounded-circle shadow-sm"
      />
      {user.username}
    </li>
  );
};

export default UserListItem;
