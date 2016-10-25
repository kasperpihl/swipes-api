import React, { Component, PropTypes } from 'react'
import Tags from 'react-tagsinput'
import { bindAll } from '../../classes/utils'

import './styles/tags-input.scss'

class TagsInput extends Component {
  constructor(props) {
    super(props)
    this.state = {tags: []}
    bindAll(this, ['handleChange'])
  }
  componentDidMount() {
  }
  handleChange(tags) {
    console.log(tags)
    this.setState({tags})
  }
  render() {

    return (
      <Tags value={this.state.tags} onChange={this.handleChange} />
    )
  }
}

export default TagsInput

const { func } = PropTypes;

TagsInput.propTypes = {
  callDelegate: func
}
