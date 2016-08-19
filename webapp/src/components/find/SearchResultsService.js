import React, { Component, PropTypes } from 'react'
import SwipesCard from '../swipes-card/SwipesCard'

class SearchResultsService extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderIcon(icon) {
    if (icon) {
      return (
        <img src={icon} />
      )
    }
  }
  render() {
    const { icon, number } = this.props;

    return (
      <div className="swipes-search-results__services__service">
        <div className="swipes-search-results__services__service--number">
          {number + ' results'}
        </div>
        <div className="swipes-search-results__services__service--service-icon">
          {this.renderIcon(icon)}
        </div>
      </div>
    )
  }
}

export default SearchResultsService

SearchResultsService.propTypes = {
  icon: PropTypes.string,
  number: PropTypes.string
}
