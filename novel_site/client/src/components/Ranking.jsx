import React, { Component } from "react";
import RankingHeader from "./subComponents/RankingHeader";
import RankingList from "./subComponents/RankingList";

class Ranking extends Component {
  render() {
    const { rank_type } = this.props;
    return (
      <div>
        <RankingHeader rank_type={rank_type} />
        <RankingList rank_type={rank_type} />
      </div>
    );
  }
}

export default Ranking;
