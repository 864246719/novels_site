import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import "./NovelCatalog.css";

import { connect } from "react-redux";
import * as actions from "../../actions";

class NovelCatalog extends Component {
  componentWillUnmount() {
    this.props.saveCurrentPageIndex(1);
  }
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }
  renderCatalogList() {
    const { novel, catalog, currentPageIndex } = this.props;
    const { novel_genre } = novel;

    let startPoint = Number(currentPageIndex - 1 + "00");
    let endPoint = Number(currentPageIndex - 1 + "99");
    if (catalog) {
      if (endPoint > catalog.length) {
        endPoint = catalog.length;
      }

      this.props.saveCatalogLength(catalog.length);
      return catalog.slice(startPoint, endPoint).map(each => {
        return (
          <dd key={`catalog_${each["novel_chapter_id"]}`}>
            <Link
              className="chapterLink"
              to={{
                pathname: `/${novel_genre}/${each["novel_id"]}/${
                  each["novel_chapter_id"]
                }`
              }}
            >
              {each["novel_chapter_name"]}
            </Link>
          </dd>
        );
      });
    } else {
      return <p>目录正在加载中......</p>;
    }
  }
  render() {
    const { catalog } = this.props;
    let catalogLength = 10;
    if (catalog) {
      catalogLength = Math.ceil(catalog.length / 99);
    }
    return (
      <div id="catalog">
        <dl>{this.renderCatalogList()}</dl>
        <Pagination indexLength={catalogLength} />
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
)(NovelCatalog);
