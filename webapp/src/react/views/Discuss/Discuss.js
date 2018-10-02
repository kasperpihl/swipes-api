import React, { PureComponent, Fragment } from 'react';
import SW from './Discuss.swiss';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import DiscussionList from 'src/react/views/Discussion/List/DiscussionList';
import HOCDiscussionOverview from 'src/react/views/Discussion/Overview/HOCDiscussionOverview';
import ActionBar from 'src/react/views/Discussion/List/ActionBar';
import TabBar from 'components/tab-bar/TabBar';
import { withOptimist } from 'react-optimist';
import SWView from 'SWView';

@withOptimist
export default class Discuss extends PureComponent {
  static sizes() {
    return [800, 910, 1080];
  }
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Following', 'All other', 'By me'],
      tabIndex: 0,
      selectedId: null,
    };
  }
  tabDidChange(i) {
    const { optimist } = this.props;
    if (i !== this.state.tabIndex) {
      this.setState({ tabIndex: i, selectedId: null }, () => {
        optimist.set('discussSelectedId', null);
      });
    }
  }
  onSelectItemId = id => {
    const { optimist } = this.props;
    const { selectedId } = this.state;

    if (id !== selectedId) {
      this.setState({ selectedId: id }, () => {
        optimist.set('discussSelectedId', id);
      });
    }
  };
  renderLeftHeader() {
    const { tabs, tabIndex } = this.state;
    return (
      <Fragment>
        <HOCHeaderTitle title="Discuss" />
        <TabBar tabs={tabs} delegate={this} activeTab={tabIndex} />
      </Fragment>
    );
  }
  renderLeftFooter() {
    return <ActionBar />;
  }
  render() {
    const { tabIndex, selectedId } = this.state;
    return (
      <SW.ParentWrapper>
        <SW.LeftSide>
          <SWView
            header={this.renderLeftHeader()}
            footer={this.renderLeftFooter()}
            noframe
          >
            <DiscussionList
              tabIndex={tabIndex}
              selectedId={selectedId}
              onSelectItemId={this.onSelectItemId}
            />
          </SWView>
        </SW.LeftSide>
        <SW.RightSide>
          {(selectedId && (
            <HOCDiscussionOverview key={selectedId} discussionId={selectedId} />
          )) ||
            'Loading'}
        </SW.RightSide>
      </SW.ParentWrapper>
    );
  }
}
