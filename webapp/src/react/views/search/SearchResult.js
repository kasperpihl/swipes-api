import React, { PureComponent } from 'react';

// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import { iconForId } from 'swipes-core-js/classes/utils';
import MileStoneResult from './MilestoneResult';
import GoalResult from './GoalResult';
import PostResult from './PostResult';
import './styles/search-result.scss';

class SearchResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onClick');
    // this.callDelegate.bindAll('onLala');
  }
  getTitle() {
    const { result } = this.props;
    const { item } = result;
    const { id } = item;

    if (id.startsWith('M') || id.startsWith('G')) {
      return item.title;
    } else if (id.startsWith('P')) {
      return item.message;
    }
  }
  renderContent() {
    const { result } = this.props;
    const { item } = result;
    const { id } = item;

    if (id.startsWith('M')) {
      return <MileStoneResult result={result} />
    } else if (id.startsWith('G')) {
      return <GoalResult result={result} />
    } else if (id.startsWith('P')) {
      return <PostResult result={result} />
    }
  }
  render() {
    const { result } = this.props;

    return (
      <div className="search-result" onClick={this.onClickCached(result.item.id, result)}>
        {this.renderContent()}
      </div>
    );
  }
}

export default SearchResult

// const { string } = PropTypes;

SearchResult.propTypes = {};
