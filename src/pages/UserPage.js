import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/apiCalls";
import ProfileCard from "../components/ProfileCard";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const UserPage = (props) => {
  const [user, setUserState] = useState([]);
  const [apiProgress, setApiProgress] = useState(false);
  const [failedResponse, setFailedResponse] = useState("");

  const { id } = useParams();
  const { auth } = props;

  useEffect(() => {
    const loadUser = async () => {
      try {
        setApiProgress(true);
        await getUserById(id).then((response) => {
          setUserState(response.data);
          //console.log("RESPONSE", response.data);
        });
        setApiProgress(false);
      } catch (error) {
        setApiProgress(true);
        setFailedResponse(error.response.data.message);
        setApiProgress(false);
      }
    };
    loadUser();
  }, [id]);

  let content = (
    <Alert type="secondary">
      <Spinner size="big" center />
    </Alert>
  );

  if (failedResponse.length < 1) {
    content = <ProfileCard user={user} auth={auth} />;
  } else {
    content = <Alert type="danger">{failedResponse}</Alert>;
  }

  return <div data-testid="user-page">{content}</div>;
};

export default UserPage;
