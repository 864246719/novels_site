import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./RankingHeader.css";

class RankingHeader extends Component {
  render() {
    const { rank_type } = this.props;
    return (
      <div id="ranking_box">
        <ul>
          <li>
            <Link
              className={
                rank_type === "novel_views_perday" ? "activeRank" : null
              }
              to="/ranking/novel_views_perday"
            >
              日点击榜
            </Link>
          </li>
          <li>
            <Link
              className={
                rank_type === "novel_views_perweek" ? "activeRank" : null
              }
              to="/ranking/novel_views_perweek"
            >
              周点击榜
            </Link>
          </li>
          <li>
            <Link
              className={
                rank_type === "novel_views_permonth" ? "activeRank" : null
              }
              to="/ranking/novel_views_permonth"
            >
              月点击榜
            </Link>
          </li>
          <li>
            <Link
              className={
                rank_type === "novel_views_total" ? "activeRank" : null
              }
              to="/ranking/novel_views_total"
            >
              总点击榜
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default RankingHeader;
