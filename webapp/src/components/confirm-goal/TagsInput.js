import React, { Component, PropTypes } from 'react'
import ReactTags from 'react-tag-autocomplete'
import { bindAll } from '../../classes/utils'

import './styles/tags.scss'

class TagsInput extends Component {
  constructor(props) {
    super(props)

    this.storeSuggestions = [
      {id: 0, name: 'Product Team 1'},
      {id: 1, name: 'Product Team 2'},
      {id: 2, name: 'Product Team 3'},
      {id: 3, name: 'Product Team 4'},
      {id: 4, name: 'Product Team 5'},
      {id: 5, name: 'Marketing Team'},
      {id: 6, name: 'Bug'},
      {id: 7, name: 'Improvement'}
    ]

    this.state = {
      tags: []
    }

    bindAll(this, ['handleDelete', 'handleAddition', 'handleClick'])
  }
  componentDidMount() {}
  handleDelete(i) {
    const { tags } = this.state;

    tags.splice(i, 1);
    this.setState({ tags: tags });
  }
  handleAddition(tag) {
    const { tags } = this.state;

    tags.push(tag);
    this.setState({ tags: tags });
  }
  handleClick(e) {
    console.log(e.target);
  }
  render() {
    const { tags } = this.state;

    const classNames = {
      root: 'sw-tags',
      rootFocused: 'sw-tags--focused',
      selected: 'sw-tags__selected',
      selectedTag: 'sw-tags__selected-tag',
      selectedTagName: 'sw-tags__selected-name',
      search: 'sw-tags__search',
      searchInput: 'sw-tags__search-input',
      suggestions: 'sw-tags__suggestions',
      suggestionActive: 'sw-tags__suggestions--active',
      suggestionDisabled: 'sw-tags__suggestions--disabled'
    }

    return (
      <ReactTags
        allowNew={true}
        classNames={classNames}
        tags={tags}
        suggestions={this.storeSuggestions}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        onClick={this.handleClick}
      />
    )
  }
}

export default TagsInput

const { func } = PropTypes;

TagsInput.propTypes = {
  callDelegate: func
}
