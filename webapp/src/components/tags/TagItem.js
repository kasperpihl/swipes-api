import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils'

import './styles/tag-item.scss'

class TagItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false
    }
    bindAll(this, ['activeToggle']);
  }
  componentDidMount() {
  }
  activeToggle() {
    const { active } = this.state;

    this.setState({
      active: !active
    })
  }
  render() {
    const { text } = this.props;
    const { active } = this.state;
    const className = active ? 'tag-item tag-item--active' : 'tag-item';

    return (
      <div className={className} onClick={this.activeToggle}>{text}</div>
    )
  }
}

export default TagItem

const { string } = PropTypes;

TagItem.propTypes = {
  text: string.isRequired
}
