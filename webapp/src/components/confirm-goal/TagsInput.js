// Modules used to implement tags input with autosuggest
// https://github.com/olahol/react-tagsinput
// https://github.com/moroshko/react-autosuggest

import React, { Component, PropTypes } from 'react'
import ReactTags from 'react-tag-autocomplete'
import { bindAll } from '../../classes/utils'

import './styles/tags-input.scss'

class TagsInput extends Component {
  constructor(props) {
    super(props)
    this.storeSuggestions = [
      {id: 3, name: 'Product Team'},
      {id: 4, name: 'Marketing Team'},
      {id: 5, name: 'Bug'},
      {id: 7, name: 'Improvement'}
    ]

    this.state = {
      tags: [],
      suggestions: []
    }
    bindAll(this, [
      'handleDelete',
      'handleAddition'
    ])
  }
  componentDidMount() {
  }
  handleDelete(i) {
    const tags = this.state.tags
    tags.splice(i, 1)
    this.setState({ tags: tags })
  }
  handleAddition(tag) {
    const tags = this.state.tags
    tags.push(tag)
    this.setState({ tags: tags })
  }
  render() {

    return (
      <ReactTags
        allowNew={true}
        tags={this.state.tags}
        suggestions={this.storeSuggestions}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition} />
    )
  }
}

export default TagsInput

const { func } = PropTypes;

TagsInput.propTypes = {
  callDelegate: func
}
