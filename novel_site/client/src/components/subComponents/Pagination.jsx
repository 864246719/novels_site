import React, { Component } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Pagination.css";

import { connect } from "react-redux";
import * as actions from "../../actions";

// 需要props：   indexLength,          currentPageIndex(默认为1，由redux提供，由此修改)
class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: 1,
      currentPageList: []
    };
  }

  // 渲染页码按键
  renderIndexPaginaton() {
    const { currentPageList } = this.state;
    const { indexLength, currentPageIndex } = this.props;
    let paginationIndexes = [];
    if (indexLength < 7) {
      for (let i = 1; i <= indexLength; i++) {
        paginationIndexes.push(i);
      }
    } else if (currentPageIndex <= 3) {
      paginationIndexes = [1, 2, 3, 4, 5, 6, 7];
    } else if (currentPageIndex >= indexLength - 3) {
      for (let i = indexLength - 6; i <= indexLength; i++) {
        paginationIndexes.push(i);
      }
    } else if (currentPageList.includes(currentPageIndex)) {
      paginationIndexes = currentPageList;
    } else {
      for (let i = 3; i >= 1; i--) {
        paginationIndexes.push(currentPageIndex - i);
      }
      paginationIndexes.push(currentPageIndex);
      for (let i = 1; i <= 3; i++) {
        paginationIndexes.push(currentPageIndex + i);
      }
    }

    const content = paginationIndexes.map(each => {
      if (each === currentPageIndex) {
        return (
          <li key={`pagi_${each}`}>
            <button className="active" onClick={this.handleIndexLocateOnclick}>
              {each}
            </button>
          </li>
        );
      }

      return (
        <li key={`pagi_${each}`}>
          <button onClick={this.handleIndexLocateOnclick}>{each}</button>
        </li>
      );
    });

    return content;
  }

  handlePreviewOnClick = () => {
    const { currentPageList } = this.state;
    const { currentPageIndex, indexLength } = this.props;
    const firstIndex = currentPageList[0];
    const shortPageList = [];
    if (firstIndex - 1 >= 1) {
      if (indexLength < 7) {
        for (let i = 1; i <= indexLength; i++) {
          shortPageList.push(i);
        }
        this.setState({ currentPageList: shortPageList });
      } else {
        currentPageList.pop();
        currentPageList.unshift(firstIndex - 1);
        this.setState({ currentPageList: currentPageList });
      }
    }

    if (currentPageIndex - 1 < 1) {
      return undefined;
    }

    window.scrollTo(0, 0);
    this.props.saveCurrentPageIndex(currentPageIndex - 1);
  };
  handleNextOnClick = () => {
    const { currentPageList } = this.state;
    const { indexLength, currentPageIndex } = this.props;
    const shortPageList = [];

    const lastIndex = currentPageList[currentPageList.length - 1];
    if (lastIndex + 1 <= indexLength) {
      if (indexLength < 7) {
        for (let i = 1; i <= indexLength; i++) {
          shortPageList.push(i);
        }
        this.setState({ currentPageList: shortPageList });
      } else {
        currentPageList.shift();
        currentPageList.push(lastIndex + 1);
        this.setState({ currentPageList: currentPageList });
      }
    }

    if (currentPageIndex + 1 > indexLength) {
      return undefined;
    }

    window.scrollTo(0, 0);
    this.props.saveCurrentPageIndex(currentPageIndex + 1);
  };
  handleFirstOnClick = () => {
    const { indexLength, currentPageIndex } = this.props;
    const shortPageList = [];
    if (indexLength < 7) {
      for (let i = 1; i <= indexLength; i++) {
        shortPageList.push(i);
      }
      this.setState({ currentPageList: shortPageList });
    } else {
      this.setState({ currentPageList: [1, 2, 3, 4, 5, 6, 7] });
    }

    if (currentPageIndex !== 1) {
      window.scrollTo(0, 0);
    }
    this.props.saveCurrentPageIndex(1);
  };
  handleLastOnClick = () => {
    const { indexLength, currentPageIndex } = this.props;
    const newCurrentPageList = [];
    const shortPageList = [];
    if (indexLength < 7) {
      for (let i = 1; i <= indexLength; i++) {
        shortPageList.push(i);
      }
      this.setState({ currentPageList: shortPageList });
    } else {
      for (let i = indexLength - 6; i <= indexLength; i++) {
        newCurrentPageList.push(i);
      }
      this.setState({ currentPageList: newCurrentPageList });
    }

    if (currentPageIndex !== 1) {
      window.scrollTo(0, 0);
    }
    this.props.saveCurrentPageIndex(indexLength);
  };
  handleOnkeyPress = e => {
    const value = Number(e.target.value);

    if (e.key === "Enter") {
      console.log(value);
      if (value && value >= 1 && value <= this.props.indexLength) {
        const newCurrentPageList = [];
        for (let i = 3; i >= 1; i--) {
          newCurrentPageList.push(value - i);
        }
        newCurrentPageList.push(value);
        for (let i = 1; i <= 3; i++) {
          newCurrentPageList.push(value + i);
        }

        this.setState({ currentPageList: newCurrentPageList });
        this.props.saveCurrentPageIndex(value);

        e.target.value = "";
        window.scrollTo(0, 0);
      } else {
        e.target.value = "";
        alert("输入错误，请重新输入！");
      }
    }
  };

  handleIndexLocateOnclick = e => {
    const textContent = Number(e.target.textContent);
    window.scrollTo(0, 0);

    this.props.saveCurrentPageIndex(textContent);
  };

  render() {
    const { indexLength, currentPageIndex } = this.props;
    return (
      <div className="pagiBox">
        <ul className="pagination">
          <li>
            <span>
              {currentPageIndex}/{indexLength}
            </span>
          </li>
          <li>
            <button onClick={this.handleFirstOnClick}>
              <i className="fas fa-angle-double-left" />
            </button>
          </li>
          <li>
            <button onClick={this.handlePreviewOnClick}>
              <i className="fas fa-chevron-left" />
            </button>
          </li>
          {this.renderIndexPaginaton()}
          <li>
            <button onClick={this.handleNextOnClick}>
              <i className="fas fa-chevron-right" />
            </button>
          </li>
          <li>
            <button onClick={this.handleLastOnClick}>
              <i className="fas fa-angle-double-right" />
            </button>
          </li>
          <li>
            <input type="text" onKeyPress={this.handleOnkeyPress} />
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps({ currentPageIndex }) {
  return { currentPageIndex };
}

export default connect(
  mapStateToProps,
  actions
)(Pagination);
