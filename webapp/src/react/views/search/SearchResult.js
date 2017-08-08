import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate, iconForId } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/search-result.scss';

class SearchResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onClick');
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  getTitle() {
    const { result } = this.props;
    const { item } = result;
    const { id } = item;
    if(id.startsWith('M') || id.startsWith('G')) {
      return item.title;
    } else if(id.startsWith('P')) {
      return item.message;
    }
  }
  render() {
    const { result } = this.props;
    return (
      <div className="search-result" onClick={this.onClickCached(result.item.id, result)}>
        <Icon
          className="search-result__icon"
          icon={iconForId(result.item.id)}
        />
        {this.getTitle()}
      </div>
    );
  }
}

export default SearchResult

// const { string } = PropTypes;

SearchResult.propTypes = {};
