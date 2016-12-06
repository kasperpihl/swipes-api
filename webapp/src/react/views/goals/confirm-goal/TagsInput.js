import React, { Component, PropTypes } from 'react';
import ReactTags from 'react-tag-autocomplete';
import { bindAll } from 'classes/utils';

import './styles/tags.scss';

class TagsInput extends Component {
  constructor(props) {
    super(props);

    this.storeSuggestions = [
      { id: 0, name: 'development' },
      { id: 1, name: 'design' },
      { id: 2, name: 'v1' },
      { id: 3, name: 'beta' },
      { id: 4, name: 'bugs' },
      { id: 5, name: 'marketing' },
      { id: 6, name: 'sales' },
      { id: 7, name: 'vacation' },
      { id: 8, name: 'team building' },
    ];

    this.state = {
      tags: [],
    };

    bindAll(this, ['handleDelete', 'handleAddition']);
  }
  componentDidMount() {}
  handleDelete(i) {
    const { tags } = this.state;

    tags.splice(i, 1);
    this.setState({ tags });
  }
  handleAddition(tag) {
    const { tags } = this.state;

    tags.push(tag);
    this.setState({ tags });
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
      suggestionActive: 'is-active',
      suggestionDisabled: 'sw-tags__suggestions--disabled',
    };

    return (
      <ReactTags
        allowNew
        classNames={classNames}
        tags={tags}
        suggestions={this.storeSuggestions}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
      />
    );
  }
}

export default TagsInput;

const { func } = PropTypes;

TagsInput.propTypes = {
  callDelegate: func,
};
