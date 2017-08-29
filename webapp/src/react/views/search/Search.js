import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
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
      </div>
    )

  }
  renderResults() {
    const { searchString, limit } = this.props;
    return (
      <HOCSearchResults
        searchString={searchString}
        limit={limit}
      />
    )
  }
  render() {
    return (
      <SWView header={this.renderSearchField()}>
        {this.renderResults()}
      </SWView>

    );
  }
}

export default Search

// const { string } = PropTypes;

Search.propTypes = {};
