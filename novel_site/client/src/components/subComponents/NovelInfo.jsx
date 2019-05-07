import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./NovelInfo.css";
import { connect } from "react-redux";
import * as actions from "../../actions";

class NovelInfo extends Component {
  componentDidMount() {
    this.getCoverImg();
  }

  getCoverImg = () => {
    const { novel_id } = this.props.novel;
    if (novel_id) {
      this.props.fetchImg(novel_id);
    }
  };
  getGenre() {
    switch (this.props.novel["novel_genre"]) {
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

  getImgCode() {
    const { images } = this.props;
    const { novel_id } = this.props.novel;
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

  renderSynopsis(synopsis) {
    const synopsisDisplay = synopsis.split(" ").map((item, key) => {
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
    const {
      novel_name,
      novel_author,
      novel_lastUpdate,
      novel_synopsis,
      novel_genre
    } = this.props.novel;
    const { lastChapterLink } = this.props;

    return (
      <div className="header">
        <div className="header_top">
          <Link className="link" to="/">
            小说网
          </Link>
          >
          <Link className="link" to={`/${novel_genre}`}>
            {this.getGenre()}
          </Link>
          >{novel_name}
        </div>
        <div className="header_mid">
          <div className="header_mid_l">
            <img src={this.getImgCode()} alt="cover_img" />
          </div>
          <div className="header_mid_r">
            <h1>{novel_name}</h1>
            <ul>
              <li>作者：{novel_author}</li>
              <li>类别：{this.getGenre()}</li>
              <li>最后更新：{novel_lastUpdate.slice(0, 10)}</li>
              <li>
                最新：
                {lastChapterLink ? (
                  <Link
                    to={{
                      pathname: `/${novel_genre}/${
                        lastChapterLink["novel_id"]
                      }/${lastChapterLink["novel_chapter_id"]}`
                    }}
                  >
                    {lastChapterLink["novel_chapter_name"]}
                  </Link>
                ) : null}
              </li>
              <li>动作:</li>
            </ul>
            <p className="synopsis">
              简介：{this.renderSynopsis(novel_synopsis)}
            </p>
          </div>
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
)(NovelInfo);
