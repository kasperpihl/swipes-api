import React, { Component, PropTypes } from 'react'
import SwipesCard from '../swipes-card/SwipesCard'
import SwipesCardList from '../swipes-card/SwipesCardList'
import Loader from '../swipes-ui/Loader'

import { FindIcon } from '../icons'
import SearchResultsService from './SearchResultsService'

class SearchResults extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderHeader(title, subtitle) {
    return (
      <div className="swipes-search-results__header">
        <div className="swipes-search-results__header__title">{title}</div>
        <div className="swipes-search-results__header__subtitle">{subtitle}</div>
      </div>
    )
  }
  renderServices() {
    const random = [
      {
        icon: 'https://www.icreatemagazine.com/wp-content/uploads/2013/12/609x609xDropbox.png.pagespeed.ic.ORJ8ZyfURY.png',
        number: '46'
      },
      {
        icon: 'https://cdn4.iconfinder.com/data/icons/free-colorful-icons/360/gmail.png',
        number: '9'
      }
    ];

    return random.map( (el, i) => {
      return <SearchResultsService key={"result-service-" + i} icon={el.icon} number={el.number} />
    })
  }
  renderResultList(results) {
    const { cardDelegate, searching } = this.props;

    if (searching) {
      return <Loader size={60} text="Searching" center={true} />
    }

    if (!results) {
      return (
        <div className="search-empty-state">
          type and press enter to search
        </div>
      )
    }

    if (results && Object.keys(results).length === 0) {
      return (
        <div className="search-no-results">
          <div className="face">
          	<div className="face__band">
          		<div className="face__band--red"></div>
          		<div className="face__band--white"></div>
          		<div className="face__band--blue"></div>
          	</div>
          	<div className="face__eyes"></div>
          	<div className="face__dimples"></div>
          	<div className="face__mouth"></div>
          </div>
          <div className="search-no-results__text">Here are not the things you are looking for!</div>
        </div>
      )
    }

    if(Array.isArray(results)){
      return results.map( (result, i) => {
        return <SwipesCard data={result} key={'search-result-' + i} delegate={cardDelegate} />
      })
    }
    else{
      const html = [];
      for(var key in results){
        var cards = results[key];
        html.push(<SwipesCardList data={{title: key, items: cards, actionLabel: 'View more results'}} delegate={cardDelegate} title={key} key={'search-result-' + key} />);
      }
      return html;
    }

  }
  render() {
    // <div className="swipes-search-results__services">
      // {this.renderServices()}
    // </div>
    const { title, subtitle, results, searching } = this.props;
    return (
      <div className="swipes-search-results">
        {this.renderHeader(title, subtitle, results)}
        <div className="flex-wrapper">
          <div className="swipes-search-results__result-list">
            {this.renderResultList(results)}
          </div>
        </div>
      </div>
    )
  }
}

export default SearchResults

SearchResults.propTypes = {
  searching: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  results: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]), // SwipesCard Proptypes
  cardDelegate: PropTypes.object.isRequired
}
