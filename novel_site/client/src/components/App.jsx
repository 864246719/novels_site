import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import ls from "local-storage";

import Header from "./Header";
import Navbar from "./Navbar";
import Landing from "./Landing";
import Genre from "./Genre";
import Ranking from "./Ranking";
import Category from "./Category";
import Chapter from "./Chapter";
import ErrorBoundary from "./ErrorBoundary";
import SearchRusult from "./SearchRusult";
import * as actions from "../actions";

class App extends Component {
  constructor(props) {
    super(props);
    this.restoreDataFromLocal();
  }

  componentDidUpdate() {
    this.saveDataToLocal();
  }

  saveDataToLocal() {
    const { catalogLength } = this.props;

    ls.set("catalogLength", catalogLength);
  }

  restoreDataFromLocal() {
    const { saveCatalogLength } = this.props;

    const local_catalogLength = ls.get("catalogLength");

    saveCatalogLength(local_catalogLength);
  }
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/:novel_genre(\d+)" component={Genre} />
            <Route
              path="/ranking/:rank_type"
              render={props => (
                <Ranking
                  key={`rank_${props.match.params.rank_type}`}
                  rank_type={props.match.params.rank_type}
                />
              )}
            />
            <Route
              exact
              path="/:novel_genre(\d+)/:novel_id(\d+)"
              component={Category}
            />
            <ErrorBoundary>
              <Route
                path="/:novel_genre/:novel_id/:novel_chapter_id"
                component={Chapter}
              />
            </ErrorBoundary>

            <Route
              path="/search/:keyword"
              render={props => (
                <SearchRusult key={`searchKey_${props.match.params.keyword}`} />
              )}
            />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { hotNovels, images, catalog, chapters } = state;

  return { hotNovels, images, catalog, chapters };
}

export default connect(
  mapStateToProps,
  actions
)(App);
