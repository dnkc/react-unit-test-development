import React from "react";
import { useParams } from "react-router-dom";
import { activate } from "../api/apiCalls";
import { useEffect, useState } from "react";
import { useIsMounted } from "../components/isMounted";

const AccountActivationPage = () => {
  const { token } = useParams();
  const [result, setResult] = useState("");
  const isMounted = useIsMounted();

  useEffect(() => {
    const apiCall = async () => {
      await activate(token)
        .then(() => {
          console.log("successful api call");
          setResult("success");
        })
        .catch(() => {
          console.log("failed api call");
          setResult("fail");
        });
    };
    apiCall();
    console.log("token: ", token);
    console.log("result: ", result);
  }, [result, token]);

  return (
    <div data-testid="activation-page">
      {result === "success" && (
        <div className="alert alert-success mt-3">Account is activated</div>
      )}
      {result === "fail" && (
        <div className="danger alert-danger mt-3">Activation failure</div>
      )}
    </div>
  );
};

export default AccountActivationPage;
