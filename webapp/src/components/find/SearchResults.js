import React, { Component, PropTypes } from 'react'
import SwipesCard from '../swipes-card/SwipesCard'
import SearchResultsServices from './SearchResultsServices'

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
      return <SearchResultsServices key={"result-service-" + i} icon={el.icon} number={el.number} />
    })
  }
  renderResultList() {
    const results = [
      {
        title: 'Invoice #7 - Swipes.pdf',
        subtitle: 'By Lois Hicks 11/08/2016 12:00PM',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, qui quas consequatur quibusdam maiores molestiae molestias rerum velit cumque explicabo.'
      },
      {
        title: 'Invoice #8 - Swipes.pdf',
        subtitle: 'By Lois Hicks 11/08/2016 12:00PM',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, qui quas consequatur quibusdam maiores molestiae molestias rerum velit cumque explicabo.'
      },
      {
        title: 'Invoice #9 - Swipes.pdf',
        subtitle: 'By Lois Hicks 11/08/2016 12:00PM',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, qui quas consequatur quibusdam maiores molestiae molestias rerum velit cumque explicabo.'
      }
    ];

    return results.map( (result, i) => {
      return <SwipesCard data={{title:result.title, subtitle: result.subtitle, description:result.description}} key={'search-result-' + i} />
    })
  }
  render() {
    const { title, subtitle } = this.props;

    return (
      <div className="swipes-search-results">
        {this.renderHeader(title, subtitle)}
        <div className="flex-wrapper">
          <div className="swipes-search-results__services">
            {this.renderServices()}
          </div>
          <div className="swipes-search-results__result-list">
            {this.renderResultList()}
          </div>
        </div>
      </div>
    )
  }
}

export default SearchResults

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object) // SwipesCard Proptypes
}
