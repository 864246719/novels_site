import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import logo from "./scale.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import * as actions from "../actions";

import Login from "./subComponents/Login";
import Register from "./subComponents/Register";

class Header extends Component {
  constructor(props) {
    super(props);
    this.searchInputRef = React.createRef();
  }

  renderLogin() {
    if (this.props.displayLoginStatus) {
      return <Login />;
    }

    if (this.props.displayRegisterStatus) {
      return <Register />;
    }
  }

  handleFormSubmit = e => {
    e.preventDefault();
  };

  handleSearchEvent = () => {
    if (this.searchInputRef.current.value.length === 0) {
      return undefined;
    }

    const { value } = this.searchInputRef.current;
    // window.location.reload();

    this.props.history.push(`/search/${value}`);

    this.props.fetchSearchResult(value);

    this.searchInputRef.current.value = "";

    this.props.saveCurrentPageIndex(1);
  };

  renderLoginPromp() {
    if (this.props.userInfo.user_id) {
      return (
        <div className="loginButton">
          <span style={{ color: "var(--secondary-color)" }}>
            {this.props.userInfo.user_nickname + " "}
          </span>
          欢迎登录!
          <button
            className="btn btn-outline-dark my-2 my-sm-0 ml-2 "
            onClick={this.props.logout}
          >
            注销
          </button>
        </div>
      );
    } else {
      return (
        <div className="loginButton">
          <button
            className="btn btn-outline-dark my-2 my-sm-0 mr-2"
            onClick={this.props.displayLogin}
          >
            登录
          </button>
          <button
            className="btn btn-outline-dark my-2 my-sm-0"
            onClick={this.props.displayRegister}
          >
            注册
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar  navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt=""
            />
            小说网
          </Link>

          <form
            className="form-inline my-2 my-lg-0"
            onSubmit={this.handleFormSubmit}
          >
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder=""
              ref={this.searchInputRef}
            />
            <button
              className="btn btn-outline-dark my-2 my-sm-0"
              type="submit"
              onClick={this.handleSearchEvent}
            >
              搜索
            </button>
          </form>
          {this.renderLoginPromp()}
        </nav>
        {this.renderLogin()}
      </div>
    );
  }
}

function mapStateToProps({
  displayLoginStatus,
  displayRegisterStatus,
  userInfo
}) {
  return { displayLoginStatus, displayRegisterStatus, userInfo };
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(Header)
);
