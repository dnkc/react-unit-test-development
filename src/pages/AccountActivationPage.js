import React from "react";
import { useParams } from "react-router-dom";
import { activate } from "../api/apiCalls";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

const AccountActivationPage = () => {
  const { token } = useParams();
  const [result, setResult] = useState("");

  const apiCall = async () => {
    await activate(token)
      .then(() => {
        //console.log("successful api call");
        setResult("success");
      })
      .catch(() => {
        // console.log("failed api call");
        setResult("fail");
      });
    // console.log("token: ", token);
    //console.log("result: ", result);
  };

  useEffect(() => {
    apiCall();
  }, []);

  let content = (
    <Alert type="secondary">
      <Spinner size="big" center />
    </Alert>
  );

  if (result === "success") {
    content = <Alert>Account is activated</Alert>;
  }
  if (result === "fail") {
    content = <Alert type="danger">Activation failure</Alert>;
  }

  return <div data-testid="activation-page">{content}</div>;
};

export default AccountActivationPage;
