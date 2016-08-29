import React, { Component, PropTypes } from 'react'
import './DropdownMenu.scss'

class SwipesDropdownMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false
    }
  }
  renderItems(data) {
    return data.map( (item, i) => {
      return (
        <div className="swipes-dropdown__menu--item" key={'DropdownMenuItem-' + item.id} onClick={this.props.onChange.bind(null, item.id)}>
          {item.title}
        </div>
      )
    })
  }
  render() {
    let { data, show } = this.props;
    let menuClass = 'swipes-dropdown__menu--closed';

    if (show) {
      menuClass = 'swipes-dropdown__menu--open';
    }

    return (
      <div className="swipes-dropdown">
        <div className={"swipes-dropdown__menu " + menuClass}>
          {this.renderItems(data)}
        </div>
      </div>
    )
  }
}

export default SwipesDropdownMenu


// <div className="swipes-dropdown__title">
//   {selectedTitle}
//   <i className="material-icons">arrow_drop_down</i>
// </div>

SwipesDropdownMenu.propTypes = {
  show: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })),
  onChange: PropTypes.func.isRequired

  // removeThis: PropTypes.string.isRequired
}
