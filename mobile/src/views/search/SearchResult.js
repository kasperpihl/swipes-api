import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { setupDelegate } from 'react-delegate';
import RippleButton from 'RippleButton';
import MilestoneResult from './MilestoneResult';
import GoalResult from './GoalResult';
import PostResult from './PostResult';

class SearchResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onOpenSearchResult');
  }
  componentDidMount() {
  }
  renderContent() {
    const { result } = this.props;
    const { item } = result;
    const { id } = item;

    if (id.startsWith('M')) {
      return <MilestoneResult result={result} />
    } else if (id.startsWith('G')) {
      return <GoalResult result={result} />
    } else if (id.startsWith('P')) {
      return <PostResult result={result} />
    }

    return undefined;
  }
  render() {
    const { result } = this.props;

    return (
      <RippleButton onPress={this.onOpenSearchResultCached(result.item.id, result)}>
        <View>
          {this.renderContent()}
        </View>
      </RippleButton>
    );
  }
}

export default SearchResult

// const { string } = PropTypes;

SearchResult.propTypes = {};
