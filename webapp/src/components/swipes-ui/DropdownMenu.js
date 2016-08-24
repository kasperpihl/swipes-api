import React, { Component, PropTypes } from 'react'
import './DropdownMenu.scss'

class SwipesDropdownMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {}
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
    let { selectedId, data } = this.props;
    let selectedTitle = '';
    if(typeof selectedId !== 'string'){
      selectedId = data[0].id;
    }
    data.forEach((item) => {
      if(item.id === selectedId){
        selectedTitle = item.title;
      }
    })

    return (
      <div className="swipes-dropdown">
        <div className="swipes-dropdown__title">
          {selectedTitle}
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
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })),
  selectedId: PropTypes.string,
  onChange: PropTypes.func.isRequired
  // removeThis: PropTypes.string.isRequired
}
