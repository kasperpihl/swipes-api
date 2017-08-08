import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/search.scss';
import HOCSearchResults from './HOCSearchResults';

class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onChange');
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  renderSearchField() {
    const { searchString } = this.props;
    return (
      <div className="search__field">
        <input type="text"
          autoFocus
          placeholder="Search for goals, milestones and posts"
          value={searchString}
          onChange={this.onChange}
        />
        <Icon icon="Find" className="search__field-svg" />
      </div>
    )

  }
  renderResults() {
    const { searchString } = this.props;
    return (
      <HOCSearchResults
        searchString={searchString}
      />
    )
  }
  render() {
    return (
      <div className="search">
        {this.renderSearchField()}
        {this.renderResults()}
      </div>
    );
  }
}

export default Search

// const { string } = PropTypes;

Search.propTypes = {};
