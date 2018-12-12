import React, { PureComponent, Fragment } from 'react';
import SW from './Discuss.swiss';
import { SwissProvider } from 'swiss-react';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import DiscussionList from 'src/react/views/Discussion/List/DiscussionList';
import HOCDiscussionOverview from 'src/react/views/Discussion/Overview/HOCDiscussionOverview';
import ActionBar from 'src/react/views/Discussion/List/ActionBar';
import TabBar from 'src/react/components/tab-bar/TabBar';
import { withOptimist } from 'react-optimist';
import SWView from 'src/react/app/view-controller/SWView';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

@navWrapper
@withOptimist
export default class Discuss extends PureComponent {
  static sizes() {
    return [800, 910, 1080, 1200];
  }
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Following', 'All other', 'By me'],
      tabIndex: 0,
      selectedId: null
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
  onSelectItemId = (id, results) => {
    const { optimist } = this.props;
    const { selectedId } = this.state;
    let newId = id;
    if (
      selectedId &&
      (!results || !results.filter(r => r.get('id') === selectedId).size)
    ) {
      newId = null;
      if (results && results.size) {
        newId = results.first().get('id');
      }
    } else if (results && selectedId) {
      return;
    }
    if (newId !== selectedId) {
      this.setState({ selectedId: id }, () => {
        optimist.set('discussSelectedId', id);
      });
    }
  };
  renderLeftHeader() {
    const { tabs, tabIndex } = this.state;
    return (
      <SW.LeftHeaderWrapper>
        <CardHeader title="Discussions" />
        <TabBar tabs={tabs} delegate={this} activeTab={tabIndex} />
      </SW.LeftHeaderWrapper>
    );
  }
  renderLeftFooter() {
    return <ActionBar />;
  }
  render() {
    const { tabIndex, selectedId } = this.state;
    const { viewWidth } = this.props;
    return (
      <SwissProvider viewWidth={viewWidth}>
        <SW.ParentWrapper>
          <SW.LeftSide>
            <SWView
              header={this.renderLeftHeader()}
              footer={this.renderLeftFooter()}
              noframe
            >
              <DiscussionList
                tabIndex={tabIndex}
                onSelectItemId={this.onSelectItemId}
                compact={viewWidth === 800}
                viewWidth={viewWidth}
              />
            </SWView>
          </SW.LeftSide>
          <SW.RightSide>
            {selectedId && (
              <HOCDiscussionOverview
                key={selectedId}
                discussionId={selectedId}
              />
            )}
          </SW.RightSide>
        </SW.ParentWrapper>
      </SwissProvider>
    );
  }
}
