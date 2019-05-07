import React, { Component } from "react";
import "./Register.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { connect } from "react-redux";
import * as actions from "../../actions";

class Register extends Component {
  constructor() {
    super();
    this.emailRef = React.createRef();
    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();
    this.nicknameRef = React.createRef();
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

  renderUserExistsTag = () => {
    return <span>邮箱或用户名已存在！</span>;
  };

  register = () => {
    let email = this.emailRef.current.value;
    let username = this.usernameRef.current.value;
    let password = this.passwordRef.current.value;
    let nickname = this.nicknameRef.current.value;

    if (email === "" || username === "" || password === "" || nickname === "") {
      return null;
    }

    const userInfo = {
      email,
      username,
      password,
      nickname
    };
    this.props.userRegister(userInfo);
  };
  render() {
    const { closeRegister, displayLogin, userInfo, clearUserInfo } = this.props;
    if (userInfo.user_id) {
      closeRegister();
    }
    return (
      <form className="box" onSubmit={this.onFormSubmit}>
        <i
          className="fas fa-window-close fa-2x cancel"
          onClick={closeRegister}
        />
        <h1>注册</h1>
        <div className="input-group">
          <label htmlFor="email">邮箱:</label>
          <input
            ref={this.emailRef}
            id="email"
            type="email"
            name="email"
            onInvalid={this.onInvalid}
            onInput={this.onInput}
            onFocus={clearUserInfo}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="username">用户名:</label>
          <input
            ref={this.usernameRef}
            id="username"
            type="text"
            name="username"
            onInvalid={this.onInvalid}
            onInput={this.onInput}
            onFocus={clearUserInfo}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">密码:</label>
          <input
            ref={this.passwordRef}
            id="password"
            type="password"
            name="password"
            onInvalid={this.onInvalid}
            onInput={this.onInput}
            onFocus={clearUserInfo}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="nickname">昵称:</label>
          <input
            ref={this.nicknameRef}
            id="nickname"
            type="text"
            name="nickname"
            onInvalid={this.onInvalid}
            onInput={this.onInput}
            onFocus={clearUserInfo}
            required
          />
        </div>

        <div className="btn-group">
          <input
            type="button"
            value="我有账号"
            onClick={() => {
              closeRegister();
              displayLogin();
            }}
          />
          <input value="注册" type="submit" onClick={this.register} />
        </div>
        {userInfo.user_id === 0 ? this.renderUserExistsTag() : null}
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
)(Register);
