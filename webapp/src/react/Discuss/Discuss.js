import React, { PureComponent, Fragment } from 'react';
import SW from './Discuss.swiss';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import DiscussionList from 'src/react/Discussion/List/DiscussionList';
import HOCDiscussionOverview from 'src/react/Discussion/Overview/HOCDiscussionOverview';
import TabBar from 'src/react/_components/TabBar/TabBar';
import { withOptimist } from 'react-optimist';
import SWView from 'src/react/_Layout/view-controller/SWView';
import ChatCreate from 'src/react/Chat/Create/ChatCreate';
import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';
import Button from 'src/react/_components/Button/Button';

@navWrapper
@withOptimist
export default class Discuss extends PureComponent {
  static sizes() {
    return [800, 910, 1080, 1200];
  }
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Following', 'All other'],
      tabIndex: 0,
      selectedId: null
    };
  }
  handleTabChange = i => {
    const { optimist } = this.props;
    if (i !== this.state.tabIndex) {
      this.setState({ tabIndex: i, selectedId: null }, () => {
        optimist.set('discussSelectedId', null);
      });
    }
  };
  handleNewDiscussion = () => {
    const { openModal } = this.props;
    openModal(ChatCreate);
  };
  onSelectItemId = (id, results) => {
    const { optimist } = this.props;
    const { selectedId } = this.state;
    let newId = id;
    if (
      selectedId &&
      (!results ||
        !results.filter(r => r.get('discussion_id') === selectedId).size)
    ) {
      newId = null;
      if (results && results.size) {
        newId = results.first().get('discussion_id');
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
        <CardHeader title="Chat">
          <Button.Rounded title="New chat" onClick={this.handleNewDiscussion} />
        </CardHeader>
        <TabBar tabs={tabs} onChange={this.handleTabChange} value={tabIndex} />
      </SW.LeftHeaderWrapper>
    );
  }
  render() {
    const { tabIndex, selectedId } = this.state;
    const { viewWidth } = this.props;
    return (
      <SW.ProvideContext viewWidth={viewWidth}>
        <SW.ParentWrapper>
          <SW.LeftSide>
            <SWView header={this.renderLeftHeader()} noframe>
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
      </SW.ProvideContext>
    );
  }
}
