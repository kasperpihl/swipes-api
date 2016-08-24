import React, { Component, PropTypes } from 'react'
import './DropdownMenu.scss'

class SwipesDropdownMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderItems(data) {

    return data.map( (item, i) => {
      return (
        <div className="swipes-dropdown__menu--item" key={'DropdownMenuItem-' + i}>
          {item.title}
        </div>
      )
    })
  }
  render() {
    const { title, data } = this.props;

    return (
      <div className="swipes-dropdown">
        <div className="swipes-dropdown__title">
          {title}
        </div>
        <div className="swipes-dropdown__menu">
          {this.renderItems(data)}
        </div>
      </div>
    )
  }
}

export default SwipesDropdownMenu

SwipesDropdownMenu.propTypes = {
  // removeThis: PropTypes.string.isRequired
}
