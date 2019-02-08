import React, { PureComponent, Fragment } from 'react';
import SW from './Discuss.swiss';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import DiscussionList from 'src/react/Discussion/List/DiscussionList';
import HOCDiscussionOverview from 'src/react/Discussion/Overview/HOCDiscussionOverview';
import TabBar from 'src/react/_components/TabBar/TabBar';
import { withOptimist } from 'react-optimist';
import SWView from 'src/react/_Layout/view-controller/SWView';
import ModalCreate from 'src/react/Modal/Create/ModalCreate';
import withNav from 'src/react/_hocs/Nav/withNav';
import Button from 'src/react/_components/Button/Button';

@withNav
@withOptimist
export default class Discuss extends PureComponent {
  static sizes = [800, 910, 1080, 1200];
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Following', 'All other'],
      tabIndex: 0,
      selectedId: null
    };
  }
  handleTabChange = i => {
    if (i !== this.state.tabIndex) {
      this.setState({ tabIndex: i });
      this.selectDiscussionId(null);
    }
  };
  handleNewDiscussion = () => {
    const { nav } = this.props;
    nav.openModal(ModalCreate, {
      type: 'discussion'
    });
  };
  selectDiscussionId(selectedId) {
    const { nav, optimist } = this.props;
    this.setState({ selectedId }, () => {
      optimist.set('discussSelectedId', selectedId);
    });
    nav.setUniqueId(selectedId);
  }
  onSelectItemId = (id, results) => {
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
      this.selectDiscussionId(id);
    }
  };
  renderLeftHeader() {
    const { tabs, tabIndex } = this.state;
    return (
      <SW.LeftHeaderWrapper>
        <CardHeader title="Chat">
          <Button.Rounded
            title="New chat"
            onClick={this.handleNewDiscussion}
            icon="Plus"
          />
        </CardHeader>
        <TabBar tabs={tabs} onChange={this.handleTabChange} value={tabIndex} />
      </SW.LeftHeaderWrapper>
    );
  }
  render() {
    const { tabIndex, selectedId } = this.state;
    const { nav } = this.props;
    return (
      <SW.ProvideContext viewWidth={nav.width}>
        <SW.ParentWrapper>
          <SW.LeftSide>
            <SWView header={this.renderLeftHeader()} noframe>
              <DiscussionList
                tabIndex={tabIndex}
                onSelectItemId={this.onSelectItemId}
                viewWidth={nav.width}
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
