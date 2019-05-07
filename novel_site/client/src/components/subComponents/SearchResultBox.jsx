import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import * as actions from "../../actions";

class SearchResultBox extends Component {
  getImgCode(novel_id) {
    const { images } = this.props;

    let imgItem;
    for (let i = 0; i < images.length; i++) {
      if (images[i].novel_id === novel_id) {
        imgItem = images[i];
      }
    }

    let imgCode = "";
    if (imgItem) {
      imgCode =
        "data:image/jpeg;base64," +
        Buffer.from(imgItem.img_content, "base64").toString();
    }

    return imgCode;
  }

  getGenre(genreId) {
    switch (genreId) {
      case 1:
        return "玄幻小说";
      case 2:
        return "修真小说";
      case 3:
        return "都市小说";
      case 4:
        return "穿越小说";
      case 5:
        return "网游小说";
      case 6:
        return "科幻小说";
      default:
        return "无类型";
    }
  }

  renderSynopsis(synopsis) {
    const synopsisDisplay = synopsis.split(" ").map((item, key) => {
      if (item.length === 0) {
        return null;
      }
      return (
        <span key={`synopsis_${key}`}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {item}
          <br />
        </span>
      );
    });

    return synopsisDisplay;
  }

  render() {
    const { novel } = this.props;

    return (
      <div className="search-result-box">
        <div className="img-container">
          <Link
            className="img-link"
            to={`/${novel["novel_genre"]}/${novel["novel_id"]}`}
          >
            <img
              className="result-img"
              src={this.getImgCode(novel["novel_id"])}
              alt=""
            />
          </Link>
        </div>

        <div className="result-brief">
          <Link to={`/${novel["novel_genre"]}/${novel["novel_id"]}`}>
            <h2>{novel["novel_name"]}</h2>
          </Link>
          <div className="result-info">
            <span>作者：{novel["novel_author"]}</span>&nbsp;|
            <span>类别：{this.getGenre(novel["novel_genre"])}</span>&nbsp;|
            <span>月点击：{novel["novel_views_permonth"]}</span>&nbsp;|
            <span>上次更新：{novel["novel_lastUpdate"].slice(0, 10)}</span>
          </div>
          <p className="synopsis">
            {this.renderSynopsis(novel["novel_synopsis"])}
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ images }) {
  return { images };
}

export default connect(
  mapStateToProps,
  actions
)(SearchResultBox);
