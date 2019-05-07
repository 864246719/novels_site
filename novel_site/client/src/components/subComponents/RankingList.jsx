import React, { Component } from "react";
import "./RankingList.css";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";

import { connect } from "react-redux";
import * as actions from "../../actions";

class RankingList extends Component {
  constructor(props) {
    super(props);
    this.state = { currentPageIndex: 1 };
  }

  componentDidMount() {
    const { currentPageIndex } = this.state;
    const { rank_type, fetchRanklist } = this.props;
    const rankInfo = { rank_type, currentPageIndex };

    fetchRanklist(rankInfo);
  }

  componentWillUnmount() {
    this.props.clearRankinglist();
    this.props.saveCurrentPageIndex(1);
  }

  getGenre(novel_genre) {
    switch (novel_genre) {
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

  renderRankList() {
    const { rankList } = this.props;
    const { currentPageIndex } = this.state;

    if (rankList.length !== 0) {
      const renderedRankingList = rankList.find(
        each => currentPageIndex in each
      );

      if (renderedRankingList) {
        return renderedRankingList[currentPageIndex].map(each => {
          return (
            <li key={`rankList_${each["novel_id"]}`}>
              <span className="rank_genre">
                [{this.getGenre(each["novel_genre"])}]
              </span>
              <span>
                <Link to={`/${each["novel_genre"]}/${each["novel_id"]}`}>
                  {each["novel_name"]}
                </Link>
              </span>
              <span>{each["novel_author"]}</span>
              <span className="rank_lastdate">
                {each["novel_lastUpdate"].slice(0, 10)}
              </span>
            </li>
          );
        });
      }
    }
  }
  render() {
    const { rank_type, currentPageIndex, fetchRanklist, rankList } = this.props;
    let indexLength = 1;
    if (rankList.length > 0) {
      indexLength = Math.ceil(rankList[0][0]["TABLE_ROWS"] / 30);
    }
    if (this.state.currentPageIndex !== currentPageIndex) {
      const rankInfo = {
        rank_type,
        currentPageIndex
      };

      fetchRanklist(rankInfo);
      setTimeout(
        () => this.setState({ currentPageIndex: currentPageIndex }),
        0
      );
    }
    return (
      <div id="rank-list-box">
        <ul id="rank-list">
          {" "}
          <li>
            <span className="rank_genre">类型</span>
            <span>小说名</span>
            <span>作者</span>
            <span className="rank_lastdate">最近更新</span>
          </li>
          {this.renderRankList()}
        </ul>
        <Pagination indexLength={indexLength} />
      </div>
    );
  }
}

function mapStateToProps({ currentPageIndex, rankList }) {
  return { currentPageIndex, rankList };
}
export default connect(
  mapStateToProps,
  actions
)(RankingList);
