import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { iconForId } from 'swipes-core-js/classes/utils';
import MileStoneResult from './MilestoneResult';
import GoalResult from './GoalResult';
import SW from './SearchResult.swiss';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onClick');
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
      return <MileStoneResult result={result} />;
    } else if (id.startsWith('G')) {
      return <GoalResult result={result} />;
    }
  }
  render() {
    const { result } = this.props;

    return (
      <SW.SearchResult onClick={this.onClickCached(result.item.id, result)}>
        {this.renderContent()}
      </SW.SearchResult>
    );
  }
}
