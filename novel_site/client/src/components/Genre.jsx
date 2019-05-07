import React, { Component } from "react";

import { connect } from "react-redux";
import SearchResultBox from "./subComponents/SearchResultBox";
import Pagination from "./subComponents/Pagination";
import * as actions from "../actions";
import "./SearchRusult.css";

// 注意：此组件下内容几乎照办SearchResult中的内容，有些相关名称也并未修改。

class Genre extends Component {
  componentDidMount() {
    const { novel_genre } = this.props.match.params;
    this.props.fetchSingleGenreNovels(Number(novel_genre));
  }

  componentWillUnmount() {
    this.props.saveCurrentPageIndex(1);
    this.props.savePageType(0);
  }

  imgIds = [];

  renderResultBox() {
    const {
      singleGenreNovels,
      addHotNovels,
      fetchImgs,
      currentPageIndex
    } = this.props;

    let startPoint = Number(currentPageIndex - 1 + "0");
    let endPoint = Number(currentPageIndex - 1 + "9");

    if (singleGenreNovels.length > 0) {
      if (this.containerRef) {
        if (!this.containerRef.firstChild) {
          for (let i = 0; i < singleGenreNovels.length; i++) {
            if (!this.imgIds.includes(singleGenreNovels[i]["novel_id"]))
              this.imgIds.push(singleGenreNovels[i]["novel_id"]);
          }
        }
      }
    }

    if (singleGenreNovels.length > 0) {
      const renderContent = singleGenreNovels
        .slice(startPoint, endPoint)
        .map(each => {
          return (
            <SearchResultBox
              key={`singleGenre_${each["novel_id"]}`}
              novel={each}
            />
          );
        });

      if (this.containerRef) {
        if (!this.containerRef.firstChild) {
          addHotNovels(singleGenreNovels);
          fetchImgs(this.imgIds);
        }
      }

      return renderContent;
    }
  }
  render() {
    const { singleGenreNovels } = this.props;
    let indexLength = 1;
    if (singleGenreNovels.length > 0) {
      indexLength = Math.ceil(singleGenreNovels.length / 10);
    }
    return (
      <div>
        <div
          ref={e => (this.containerRef = e)}
          className="search-result-container"
        >
          {this.renderResultBox()}
        </div>
        <Pagination indexLength={indexLength} />
      </div>
    );
  }
}

function mapStateToProps({ singleGenreNovels, currentPageIndex }) {
  return { singleGenreNovels, currentPageIndex };
}

export default connect(
  mapStateToProps,
  actions
)(Genre);
