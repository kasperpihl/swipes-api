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
    let { data, show, reverse, styles } = this.props;
    let menuClass = 'swipes-dropdown--closed';

    if (show) {
      menuClass = 'swipes-dropdown--open';
    }

    if (reverse) {
      menuClass += ' swipes-dropdown--right'
    }

    return (
      <div className={"swipes-dropdown " + menuClass}>
        <div className="swipes-dropdown__clickable-bg"></div>
        <div className="swipes-dropdown__menu" style={styles}>
          {this.renderItems(data)}
        </div>
      </div>
    )
  }
}

export default SwipesDropdownMenu

SwipesDropdownMenu.propTypes = {
  show: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })),
  onChange: PropTypes.func
}
