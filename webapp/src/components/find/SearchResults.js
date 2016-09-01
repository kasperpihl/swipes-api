import React, { Component, PropTypes } from 'react'
import SwipesCard from '../swipes-card/SwipesCard'
import SwipesCardList from '../swipes-card/SwipesCardList'
import Loader from '../swipes-ui/Loader'

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
    const { cardDelegate, searching } = this.props;
    if(searching){
      return <Loader size={60} text="Searching" center={true} />
    }
    if(!results) return;

    
    if(Array.isArray(results)){
      return results.map( (result, i) => {
        return <SwipesCard data={result} key={'search-result-' + i} delegate={cardDelegate} />
      })
    }
    else{
      const html = [];
      for(var key in results){
        var cards = results[key];
        html.push(<SwipesCardList data={{title: key, items: cards}} delegate={cardDelegate} title={key} key={'search-result-' + key} />);
      }
      return html;
    }

  }
  render() {
    const { title, subtitle, results, searching } = this.props;
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
  searching: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  results: PropTypes.object, // SwipesCard Proptypes
  cardDelegate: PropTypes.object.isRequired
}
