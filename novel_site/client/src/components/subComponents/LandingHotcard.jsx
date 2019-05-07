import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";

class LandingHotcard extends Component {
  renderGenreName(genreId) {
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

  handleLinkOnClick = novel_id => {
    const { clearImg } = this.props;
    clearImg();

    this.props.fetchCatalog(novel_id);
  };

  renderNovelsList(remainNovels) {
    return remainNovels.map(each => {
      // console.log(each);
      return (
        <li key={`hot_${each["novel_genre"]}_${each["novel_id"]}`}>
          <Link
            to={{
              pathname: `/${each["novel_genre"]}/${each["novel_id"]}`
            }}
            onClick={() => this.handleLinkOnClick(each["novel_id"])}
          >
            {each["novel_name"]}
          </Link>
          <span>/著：{each["novel_author"]}</span>
        </li>
      );
    });
  }

  render() {
    const { novelList, images } = this.props;
    const firtsNovel = novelList[0];
    const genreId = firtsNovel["novel_genre"];
    const remainNovels = novelList.slice(1);

    const imgItem = images.find(each => each.novel_id === firtsNovel.novel_id);
    let imgCode = imgItem
      ? "data:image/jpeg;base64," +
        Buffer.from(imgItem.img_content, "base64").toString()
      : "";

    return (
      <div className="novel-hotcard">
        <h2>{this.renderGenreName(genreId)}</h2>
        <div className="novel-brief">
          <img className="cover_img" src={imgCode} alt="cover img" />
          <div className="novel-brief-text">
            <div>
              <Link
                to={{
                  pathname: `/${firtsNovel["novel_genre"]}/${
                    firtsNovel["novel_id"]
                  }`,
                  state: {
                    novel: firtsNovel
                  }
                }}
                onClick={() => this.handleLinkOnClick(firtsNovel["novel_id"])}
              >
                {firtsNovel["novel_name"]}
              </Link>
              /著： {firtsNovel["novel_author"]}
            </div>
            <p>{firtsNovel["novel_synopsis"].slice(0, 40)}......</p>
          </div>
        </div>
        <ul>{this.renderNovelsList(remainNovels)}</ul>
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
)(LandingHotcard);
