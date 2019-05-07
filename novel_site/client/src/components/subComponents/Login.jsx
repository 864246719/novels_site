import React, { Component } from "react";
import "./Login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { connect } from "react-redux";
import * as actions from "../../actions";

class Login extends Component {
  constructor() {
    super();
    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();
  }
  onFormSubmit = e => {
    e.preventDefault();
  };
  onInvalid = e => {
    e.target.setCustomValidity("请填写内容。");
  };
  onInput = e => {
    e.target.setCustomValidity("");
  };

  renderWrongPasswdInfo = () => {
    return <p style={{}}>用户名或密码错误！</p>;
  };
  login = () => {
    let username = this.usernameRef.current.value;
    let password = this.passwordRef.current.value;
    if (username === "" || password === "") {
      return null;
    }
    const accountInfo = {
      username,
      password
    };

    this.props.userLogin(accountInfo);
  };
  render() {
    const { closeLogin, displayRegister, userInfo, clearUserInfo } = this.props;
    if (userInfo.user_id) {
      closeLogin();
    }
    return (
      <form className="box" onSubmit={this.onFormSubmit}>
        <i className="fas fa-window-close fa-2x cancel" onClick={closeLogin} />
        <h1>登录</h1>
        <input
          ref={this.usernameRef}
          type="text"
          name="username"
          placeholder="用户名"
          onInvalid={this.onInvalid}
          onInput={this.onInput}
          onFocus={clearUserInfo}
          required
        />
        <input
          ref={this.passwordRef}
          type="password"
          name="password"
          placeholder="密码"
          onInvalid={this.onInvalid}
          onInput={this.onInput}
          onFocus={clearUserInfo}
          required
        />
        <div className="btn-group">
          <input type="submit" value="登录" onClick={this.login} />
          <input
            type="button"
            value="注册"
            onClick={() => {
              closeLogin();
              displayRegister();
            }}
          />
        </div>
        {userInfo.user_id === 0 ? this.renderWrongPasswdInfo() : null}
      </form>
    );
  }
}

function mapStateToProps({ userInfo }) {
  return { userInfo };
}

export default connect(
  mapStateToProps,
  actions
)(Login);
