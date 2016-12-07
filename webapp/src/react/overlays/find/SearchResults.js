import React, { Component, PropTypes } from 'react';
import SwipesCard from 'components/swipes-card/SwipesCard';
import SwipesCardList from 'components/swipes-card/SwipesCardList';
import Loader from 'components/swipes-ui/Loader';
import './styles/search-results.scss';
// import { FindIcon } from '../icons'

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderResultList() {
    const { cardDelegate, searching, results } = this.props;

    if (searching) {
      return <Loader size={60} text="Searching" center />;
    }

    if (!results) {
      return (
        <div className="search-results__empty-state">
          Type and press &aposEnter&apos to search
        </div>
      );
    }

    if (results && Object.keys(results).length === 0) {
      return (
        <div className="search-results__no-results">
          <div className="face">
            <div className="face__band">
              <div className="face__band--red" />
              <div className="face__band--white" />
              <div className="face__band--blue" />
            </div>
            <div className="face__eyes" />
            <div className="face__dimples" />
            <div className="face__mouth" />
          </div>
          <div className="search-results__no-results__text">
            Here are not the things you are looking for!
          </div>
        </div>
      );
    }

    if (Array.isArray(results)) {
      return results.map((result, i) => <SwipesCard data={result} key={`search-result-${i}`} delegate={cardDelegate} />);
    }

    const html = [];

    const keys = Object.keys(results);

    keys.forEach((key) => {
      let cards = results[key];

      cards = cards.map((obj) => {
        if (obj.shareData) {
          return (
            Object.assign(
              {},
              obj.shareData.meta,
              {
                service: obj.doc.source,
                xendo_id: obj.doc.id,
              },
            )
          );
        }

        return obj;
      });

      html.push(<SwipesCardList data={{ title: key, items: cards, actionLabel: 'View more results' }} delegate={cardDelegate} title={key} key={`search-result-${key}`} />);
    });

    return html;
  }
  renderQuery() {
    const { searching, query } = this.props;

    if (!searching && query && query.length) {
      return <div className="search-results__query">{`Showing results for:  ${query}`}</div>;
    }

    return undefined;
  }
  render() {
    return (
      <div className="search-results">
        {this.renderQuery()}
        {this.renderResultList()}
      </div>
    );
  }
}

export default SearchResults;

const { bool, string, oneOfType, object, array } = PropTypes;

SearchResults.propTypes = {
  searching: bool,
  query: string,
  results: oneOfType([
    array,
    object,
  ]), // SwipesCard Proptypes
  cardDelegate: object.isRequired,
};
