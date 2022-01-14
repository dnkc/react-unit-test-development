import React, { Component } from "react";
import { loadUsers } from "../api/apiCalls";

class UserList extends Component {
  state = {
    page: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0,
    },
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = (pageIndex) => {
    try {
      loadUsers(pageIndex).then((response) => {
        this.setState({ page: response.data });
      });
    } catch (error) {}
  };

  render() {
    const { totalPages, page, content } = this.state.page;

    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>Users</h3>
        </div>
        <ul className="list-group list-grou-flush">
          {content.map((user) => {
            return (
              <li
                key={user.id}
                className="list-group-item list-group-item-action"
              >
                {user.username}
              </li>
            );
          })}
        </ul>
        <div className="card-footer">
          {page !== 0 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => this.loadData(page - 1)}
            >
              {"< prev"}
            </button>
          )}
          {totalPages > page + 1 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => this.loadData(page + 1)}
            >
              {"next >"}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default UserList;
