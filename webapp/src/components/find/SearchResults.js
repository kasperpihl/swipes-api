import React, { Component, PropTypes } from 'react'
import SwipesCard from '../swipes-card/SwipesCard'
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
        <div className="swipes-search-results__header--title">{title}</div>
        <div className="swipes-search-results__header--subtitle">{subtitle}</div>
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
    if(!results) return;
    const { cardOnClick } = this.props;
    
    return results.map( (result, i) => {
      return <SwipesCard data={result} key={'search-result-' + i} onClick={cardOnClick} />
    })
  }
  render() {
    const { title, subtitle, results } = this.props;

    return (
      <div className="swipes-search-results">
        {this.renderHeader(title, subtitle)}
        <div className="flex-wrapper">
          <div className="swipes-search-results__services">
            {this.renderServices()}
          </div>
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
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  results: PropTypes.arrayOf(PropTypes.object), // SwipesCard Proptypes
  cardOnClick: PropTypes.func
}
