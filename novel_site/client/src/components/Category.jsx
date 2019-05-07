import React, { Component } from "react";
import NovelInfo from "./subComponents/NovelInfo";
import NovelCatalog from "./subComponents/NovelCatalog";

import { connect } from "react-redux";
import * as actions from "../actions";

class Category extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    const { novel_id } = this.props.match.params;
    this.props.fetchCatalog(Number(novel_id));
  }
  componentDidUpdate() {}
  getNovelFromNovels = () => {
    const { novels } = this.props;
    const { novel_id, novel_genre } = this.props.match.params;
    const singleType_novels = novels[Number(novel_genre) - 1];
    const novel = singleType_novels.find(
      each => each["novel_id"] === Number(novel_id)
    );
    if (!novel) {
      this.props.fetchNovel(Number(novel_id));
    }

    return novel;
  };

  renderAllContent(novel) {
    const { catalogs } = this.props;
    let catalog, lastChapterLink;

    if (
      catalogs.length !== 0 &&
      catalogs.find(each => novel["novel_id"] in each)
    ) {
      catalog = catalogs.find(each => novel["novel_id"] in each);

      catalog = catalog[novel["novel_id"]];

      lastChapterLink = catalog[catalog.length - 1];
    }

    return (
      <div>
        <NovelInfo novel={novel} lastChapterLink={lastChapterLink} />
        <NovelCatalog catalog={catalog} novel={novel} />
      </div>
    );
  }

  render() {
    const novel = this.getNovelFromNovels();

    if (novel) {
      return this.renderAllContent(novel);
    } else {
      return null;
    }
  }
}

function mapStateToProps({ catalog, hotNovels }) {
  return {
    catalogs: catalog,
    novels: hotNovels
  };
}

export default connect(
  mapStateToProps,
  actions
)(Category);
