import React, { PureComponent } from 'react';
import SW from './DiscussionOverview.swiss';
import DiscussionHeader from '../Header/DiscussionHeader';
import SWView from 'SWView';

export default class DiscussionOverview extends PureComponent {
  static sizes() {
    return [654];
  }
  renderFooter() {
    
  }
  render() {
    return (
      <SWView
        header={<DiscussionHeader />}
        footer={this.renderFooter()}
      >
      </SWView>
    );
  }
}
