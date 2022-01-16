import React, { useState, useEffect } from "react";
import { loadUsers } from "../api/apiCalls";
import UserListItem from "./UserListItem";
import { withTranslation } from "react-i18next";
import Spinner from "./Spinner";

const UserList = (props) => {
  const [userState, setUserState] = useState({
    state: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0,
    },
  });
  const [apiProgress, setApiProgress] = useState(false);

  const { navigate } = props;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (pageIndex) => {
    setApiProgress(true);
    try {
      await loadUsers(pageIndex).then((response) => {
        setUserState({ ...userState, state: response.data });
      });
      setApiProgress(false);
    } catch (error) {}
  };

  const { totalPages, page, content } = userState.state;
  const { t } = props;
  return (
    <div className="card">
      <div className="card-header text-center">
        <h3>{t("users")}</h3>
      </div>
      <ul className="list-group list-grou-flush">
        {content.map((user) => {
          return <UserListItem key={user.id} user={user} navigate={navigate} />;
        })}
      </ul>
      <div className="card-footer text-center">
        {page !== 0 && !apiProgress && (
          <button
            className="btn btn-outline-secondary btn-sm float-start"
            onClick={() => loadData(page - 1)}
          >
            {t("prevPage")}
          </button>
        )}
        {totalPages > page + 1 && !apiProgress && (
          <button
            className="btn btn-outline-secondary btn-sm float-end"
            onClick={() => loadData(page + 1)}
          >
            {t("nextPage")}
          </button>
        )}
        {apiProgress && <Spinner />}
      </div>
    </div>
  );
};

export default withTranslation()(UserList);
