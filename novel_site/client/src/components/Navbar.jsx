import React, { Component } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNavbar: false
    };
  }
  handleGenreClick = e => {
    const { href, classList } = e.target;
    const url = href[href.length - 1];
    this.props.savePageType(Number(url));

    //当前标签有className时，即有activeLink的class时，阻止onclick事件
    if (classList.length !== 0) {
      return undefined;
    }

    this.props.fetchSingleGenreNovels(Number(url));
    this.props.clearSingleGenreNovels();
    this.props.saveCurrentPageIndex(1);

    this.setState({ showNavbar: false });
  };

  handleOnclick = () => {
    const { showNavbar } = this.state;
    showNavbar
      ? this.setState({ showNavbar: false })
      : this.setState({ showNavbar: true });
  };
  handleRankOnclick = () => {
    this.setState({ showNavbar: false });
  };

  handleMainOnclisk = () => {
    this.setState({ showNavbar: false });
  };

  render() {
    const { pageType } = this.props;
    const { showNavbar } = this.state;

    return (
      <div className="nav">
        <div className="icon-box" onClick={this.handleOnclick}>
          <i className="fas fa-bars fa-2x" />
        </div>
        <ul className={showNavbar ? "hamburger" : null}>
          <li>
            <Link to="/" onClick={this.handleMainOnclisk}>
              主页
            </Link>
          </li>
          <li>
            <Link
              to="/1"
              className={pageType === 1 ? "activeLink" : null}
              onClick={this.handleGenreClick}
            >
              玄幻小说
            </Link>
          </li>
          <li>
            <Link
              to="/2"
              className={pageType === 2 ? "activeLink" : null}
              onClick={this.handleGenreClick}
            >
              修真小说
            </Link>
          </li>
          <li>
            <Link
              to="/3"
              className={pageType === 3 ? "activeLink" : null}
              onClick={this.handleGenreClick}
            >
              都市小说
            </Link>
          </li>
          <li>
            <Link
              to="/4"
              className={pageType === 4 ? "activeLink" : null}
              onClick={this.handleGenreClick}
            >
              穿越小说
            </Link>
          </li>
          <li>
            <Link
              to="/5"
              className={pageType === 5 ? "activeLink" : null}
              onClick={this.handleGenreClick}
            >
              网游小说
            </Link>
          </li>
          <li>
            <Link
              to="/6"
              className={pageType === 6 ? "activeLink" : null}
              onClick={this.handleGenreClick}
            >
              科幻小说
            </Link>
          </li>
          <li onClick={this.handleRankOnclick}>
            <Link to="/ranking/novel_views_total">排行榜</Link>
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps({ pageType }) {
  return { pageType };
}

export default connect(
  mapStateToProps,
  actions
)(Navbar);
