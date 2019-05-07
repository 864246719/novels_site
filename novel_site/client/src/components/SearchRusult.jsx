import React, { Component } from "react";
import { connect } from "react-redux";
import Pagination from "./subComponents/Pagination";

import SearchResultBox from "./subComponents/SearchResultBox";
import * as actions from "../actions";
import "./SearchRusult.css";

class SearchRusult extends Component {
  imgIds = [];

  componentWillUnmount() {
    this.props.clearSearchResult();
    this.props.saveCurrentPageIndex(1);
  }
  renderResultBox() {
    const {
      searchResult,
      addHotNovels,
      fetchImgs,
      currentPageIndex
    } = this.props;

    let startPoint = Number(currentPageIndex - 1 + "0");
    let endPoint = Number(currentPageIndex - 1 + "9");

    if (searchResult.length > 0) {
      if (this.containerRef) {
        if (!this.containerRef.firstChild) {
          for (let i = 0; i < searchResult.length; i++) {
            if (!this.imgIds.includes(searchResult[i]["novel_id"]))
              this.imgIds.push(searchResult[i]["novel_id"]);
          }
        }
      }
    }

    if (searchResult.length > 0) {
      const renderContent = searchResult
        .slice(startPoint, endPoint)
        .map(each => {
          return (
            <SearchResultBox key={`result_${each["novel_id"]}`} novel={each} />
          );
        });

      if (this.containerRef) {
        if (!this.containerRef.firstChild) {
          addHotNovels(searchResult);
          fetchImgs(this.imgIds);
        }
      }

      return renderContent;
    }
  }

  render() {
    const { searchResult } = this.props;
    let indexLength = 1;
    if (searchResult.length > 0) {
      indexLength = Math.ceil(searchResult.length / 10);
    }
    return (
      <div>
        <div
          className="search-result-container"
          ref={e => (this.containerRef = e)}
        >
          {this.renderResultBox()}
        </div>

        <Pagination indexLength={indexLength} />
      </div>
    );
  }
}

function mapStateToProps({ searchResult, currentPageIndex }) {
  return { searchResult, currentPageIndex };
}

export default connect(
  mapStateToProps,
  actions
)(SearchRusult);
