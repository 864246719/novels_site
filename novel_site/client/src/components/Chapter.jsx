import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import "./Chapter.css";

import { connect } from "react-redux";
import * as actions from "../actions";

class Chapter extends Component {
  constructor() {
    super();
    this.contentBoxRef = React.createRef();
    this.state = { delayButton: false };
  }

  componentWillUnmount() {
    this.props.clearChapterContent();
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchChapters(1);

    // 自动聚焦当前组件
    ReactDOM.findDOMNode(this.contentBoxRef.current).focus();
  }

  renderGenreName(genreId) {
    genreId = Number(genreId);
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

  // 一次性向服务器索要当前novel_chapter_id之前及之后的count数量的章节
  fetchChapters = count => {
    const { chapters, catalogLength } = this.props;
    let { novel_chapter_id, novel_id } = this.props.match.params;

    novel_chapter_id = Number(novel_chapter_id);
    novel_id = Number(novel_id);
    let chapterInfo;
    let chapterIds = [];
    const startpoint = novel_chapter_id - count;

    for (let i = startpoint; i <= novel_chapter_id + count; i++) {
      if (chapters.length !== 0) {
        if (chapters.find(each => each.novel_chapter_id === i)) {
          continue;
        }
      }

      if (i <= 0) {
        continue;
      }

      if (catalogLength) {
        if (i > catalogLength) {
          break;
        }
      } else {
        this.props.fetchCatalog(novel_id);
      }

      chapterIds.push(i);
    }

    if (chapterIds.length === 0) {
      return undefined;
    }

    chapterInfo = {
      novel_id,
      chapterIds
    };

    this.props.fetchChaptersList(chapterInfo);
  };

  getNovelFromNovels = () => {
    const { novels } = this.props;
    const { novel_id, novel_genre } = this.props.match.params;

    const singleType_novels = novels[Number(novel_genre) - 1];

    const temp = {};

    const novel = singleType_novels.find(
      each => each["novel_id"] === Number(novel_id)
    );

    if (!novel) {
      this.props.fetchNovel(Number(novel_id));
      temp["novel_name"] = "。。。";
      return temp;
    }

    return novel;
  };

  getChapterFromChapters = () => {
    const { chapters } = this.props;
    let { novel_chapter_id } = this.props.match.params;
    novel_chapter_id = Number(novel_chapter_id);

    let chapter, chapterContent;
    chapterContent = "正在加载中......";
    if (chapters.length !== 0) {
      chapter = chapters.find(
        each => each.novel_chapter_id === novel_chapter_id
      );

      if (chapter) {
        chapterContent = chapter["novel_chapter_content"];

        chapterContent = chapterContent.split("    ").map((item, key) => {
          //  清除《笔趣阁》的标记
          if (item.includes("biquge")) {
            return null;
          }
          // 清除空行
          if (item.length <= 2) {
            return null;
          }
          return (
            <span key={`chapterString_${key}`}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {item}
              <br />
              <br />
            </span>
          );
        });
      }
    }

    return chapterContent;
  };

  getChapterNameFromChapter() {
    const { chapters } = this.props;
    let { novel_chapter_id } = this.props.match.params;
    novel_chapter_id = Number(novel_chapter_id);
    let chapter;

    if (chapters.length !== 0) {
      chapter = chapters.find(
        each => each.novel_chapter_id === novel_chapter_id
      );

      if (chapter) {
        return chapter["novel_chapter_name"];
      }
    }

    return null;
  }

  getChapterNameFromCatalog() {
    let { novel_chapter_id } = this.props.match.params;
    novel_chapter_id = Number(novel_chapter_id);
    const { catalog } = this.props;
    const chapterItem = catalog.find(
      each => each.novel_chapter_id === novel_chapter_id
    );

    let novel_chapter_name = chapterItem ? chapterItem.novel_chapter_name : "";
    return novel_chapter_name;
  }

  handleArowKeyPress = e => {
    const { delayButton } = this.state;
    if (e.keyCode === 37 && !delayButton) {
      this.previewKeyRef.click();
    }

    if (e.keyCode === 39 && !delayButton) {
      this.nextKeyRef.click();
    }
  };

  // 用于控制点击下一章或上一章之后的事件
  handleButtonOnClick = () => {
    window.scrollTo(0, 0);
    this.fetchChapters(10);

    const { chapters } = this.props;
    this.setState({ delayButton: true });

    //在用户第一次点击下一页时会进行20章节内容的同时获取，此时禁止用户点击“下一章”3秒钟（为了等待数据成功获取)
    if (chapters.length > 2 && chapters.length < 5) {
      setTimeout(() => this.setState({ delayButton: false }), 3000);
    } else {
      setTimeout(() => this.setState({ delayButton: false }), 500);
    }
  };

  renderChapterNavTag() {
    let { novel_genre, novel_id, novel_chapter_id } = this.props.match.params;
    let { catalogLength } = this.props;
    novel_genre = Number(novel_genre);
    novel_id = Number(novel_id);
    novel_chapter_id = Number(novel_chapter_id);

    let previewNavMsg, nextNavMsg;
    if (novel_chapter_id - 1 === 0) {
      previewNavMsg = `/${novel_genre}/${novel_id}/${novel_chapter_id}`;
    } else {
      previewNavMsg = `/${novel_genre}/${novel_id}/${novel_chapter_id - 1}`;
    }
    if (novel_chapter_id === catalogLength) {
      nextNavMsg = `/${novel_genre}/${novel_id}/${novel_chapter_id}`;
    } else {
      nextNavMsg = `/${novel_genre}/${novel_id}/${novel_chapter_id + 1}`;
    }

    return (
      <ul className="chapter_nav">
        <li>
          <Link to={previewNavMsg}>
            <button
              className="chapter_nav_Link"
              ref={button => (this.previewKeyRef = button)}
              onClick={this.handleButtonOnClick}
            >
              上一章
            </button>
          </Link>
        </li>
        <li>
          <Link className="chapter_nav_Link" to={`/${novel_genre}/${novel_id}`}>
            目录
          </Link>
        </li>
        <li>
          <Link className="chapter_nav_Link" to={nextNavMsg}>
            <button
              className="chapter_nav_Link"
              ref={button => (this.nextKeyRef = button)}
              onClick={this.handleButtonOnClick}
            >
              下一章
            </button>
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    let { novel_genre, novel_id } = this.props.match.params;
    novel_genre = Number(novel_genre);
    novel_id = Number(novel_id);

    const novel = this.getNovelFromNovels();

    return (
      <div
        className="chapter-box"
        onKeyDown={this.handleArowKeyPress}
        tabIndex="0"
        ref={this.contentBoxRef}
      >
        <div className="chapter-box-top">
          <Link className="link" to="/">
            小说网
          </Link>
          >
          <Link className="link" to={`/${novel_genre}`}>
            {this.renderGenreName(novel_genre)}
          </Link>
          >
          <Link
            className="link"
            to={{
              pathname: `/${novel_genre}/${novel_id}`
            }}
          >
            {novel["novel_name"]}
          </Link>
          >
          {this.getChapterNameFromCatalog() || this.getChapterNameFromChapter()}
        </div>
        <div className="chapter-main">
          <div className="chapter_head">
            <h1>
              {this.getChapterNameFromCatalog() ||
                this.getChapterNameFromChapter()}
            </h1>
            {this.renderChapterNavTag()}
          </div>

          <div id="chapter-content">{this.getChapterFromChapters()}</div>
          <div id="chapter_footer">{this.renderChapterNavTag()}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ chapters, hotNovels, catalog, catalogLength }) {
  return { chapters, novels: hotNovels, catalog, catalogLength };
}

export default connect(
  mapStateToProps,
  actions
)(Chapter);
