import React from "react";
import Spinner from "./Spinner";

const Button = (props) => {
  const { buttonDisabled, apiProgress, onClick } = props;
  return (
    <button
      disabled
      className="btn btn-primary"
      disabled={buttonDisabled || apiProgress}
      onClick={onClick}
    >
      {apiProgress && <Spinner />}
      {props.children}
    </button>
  );
};

export default Button;
