import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";

import "./Landing.css";

import LandingHotcard from "./subComponents/LandingHotcard";

class Landing extends Component {
  willFetchIds = [];
  componentDidMount() {
    let genreIds = [1, 2, 3, 4, 5, 6];
    this.props.fetchHotNovels(genreIds);
  }
  renderLandingHotcard() {
    const { novels, fetchImgs } = this.props;

    if (
      novels[0].length > 0 &&
      novels[1].length > 0 &&
      novels[2].length > 0 &&
      novels[3].length > 0 &&
      novels[4].length > 0 &&
      novels[5].length > 0
    ) {
      if (this.containerRef) {
        if (!this.containerRef.firstChild) {
          for (let i = 0; i < novels.length; i++) {
            this.willFetchIds.push(novels[i][0]["novel_id"]);
          }
          fetchImgs(this.willFetchIds);
        }
      }

      const renderContent = novels.map((each, i) => {
        return (
          <LandingHotcard key={`genreId_${i}`} novelList={each.slice(0, 12)} />
        );
      });

      return renderContent;
    }

    return undefined;
  }
  render() {
    return (
      <div className="hotcard-group" ref={e => (this.containerRef = e)}>
        {this.renderLandingHotcard()}
      </div>
    );
  }
}

function mapStateToProps({ hotNovels }) {
  return { novels: hotNovels };
}

export default connect(
  mapStateToProps,
  actions
)(Landing);
