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
  openMenu() {
    this.setState({menuOpen: true})
  }
  closeMenu() {
    this.setState({menuOpen: false})
  }
  render() {
    let { selectedId, data } = this.props;
    let menuClass = 'swipes-dropdown__menu--closed';
    let selectedTitle = '';

    if(typeof selectedId !== 'string'){
      selectedId = data[0].id;
    }

    data.forEach((item) => {
      if(item.id === selectedId){
        selectedTitle = item.title;
      }
    })

    if (this.state.menuOpen) {
      menuClass = 'swipes-dropdown__menu--open';
    }

    return (
      <div className="swipes-dropdown" onMouseEnter={this.openMenu.bind(this)} onMouseLeave={this.closeMenu.bind(this)}>
        <div className="swipes-dropdown__title">
          {selectedTitle}
          <i className="material-icons">arrow_drop_down</i>
        </div>
        <div className={"swipes-dropdown__menu " + menuClass} onClick={this.closeMenu.bind(this)}>
          {this.renderItems(data)}
        </div>
      </div>
    )
  }
}

export default SwipesDropdownMenu

SwipesDropdownMenu.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })),
  selectedId: PropTypes.string,
  onChange: PropTypes.func.isRequired
  // removeThis: PropTypes.string.isRequired
}
