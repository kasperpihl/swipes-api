// Modules used to implement tags input with autosuggest
// https://github.com/olahol/react-tagsinput
// https://github.com/moroshko/react-autosuggest

import React, { Component, PropTypes } from 'react'
import Tags from 'react-tagsinput'
import Autosuggest from 'react-autosuggest'
import { bindAll } from '../../classes/utils'

import './styles/tags-input.scss'

class TagsInput extends Component {
  constructor(props) {
    super(props)
    this.storeSuggestions = [
      'Product Team',
      'Marketing Team',
      'Bug',
      'Improvement'
    ]

    this.state = {
      tags: [],
      suggestions: []
    }
    bindAll(this, [
      'handleChange',
      'autosuggestRenderInput',
      'onSuggestionsFetchRequested',
      'onSuggestionsClearRequested'
    ])
  }
  componentDidMount() {
  }
  handleChange(tags) {
    this.setState({tags})
  }
  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0 ? [] : this.storeSuggestions.filter(s =>
      s.toLowerCase().slice(0, inputLength) === inputValue
    )
  }
  onSuggestionsFetchRequested({ value }) {
     this.setState({
       suggestions: this.getSuggestions(value)
     })
  }
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    })
  }
  autosuggestRenderInput(props) {
    // Removing addTag attr
    // We need it only if we are using the default RenderInput
    delete props.addTag

    return (
      <Autosuggest
        ref={props.ref}
        suggestions={this.state.suggestions}
        shouldRenderSuggestions={(value) => value && value.trim().length > 0}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={(suggestion) => suggestion.name}
        renderSuggestion={(suggestion) => <span>{suggestion.name}</span>}
        inputProps={props}
        onSuggestionSelected={(e, {suggestion}) => {
          this.refs.tagsinput.addTag(suggestion.name)
        }}
      />
    )
  }
  render() {

    return (
      <Tags ref="tagsinput" value={this.state.tags} onChange={this.handleChange} renderInput={this.autosuggestRenderInput} />
    )
  }
}

export default TagsInput

const { func } = PropTypes;

TagsInput.propTypes = {
  callDelegate: func
}
