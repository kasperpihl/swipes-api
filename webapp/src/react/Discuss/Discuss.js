import React, { PureComponent } from 'react';
import SW from './Discuss.swiss';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import DiscussionList from 'src/react/Discussion/List/DiscussionList';
import DiscussionOverview from 'src/react/Discussion/Overview/DiscussionOverview';
import TabBar from 'src/react/_components/TabBar/TabBar';
import { withOptimist } from 'react-optimist';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import ModalCreate from 'src/react/Modal/Create/ModalCreate';
import withNav from 'src/react/_hocs/Nav/withNav';
import Button from 'src/react/_components/Button/Button';

@withNav
@withOptimist
export default class Discuss extends PureComponent {
  static sizes = [800, 910];
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
  onSelectItemId = id => {
    const { selectedId } = this.state;
    if (id !== selectedId) {
      this.selectDiscussionId(id);
    }
  };
  renderLeftHeader() {
    const { tabs, tabIndex } = this.state;
    return (
      <SW.LeftHeaderWrapper>
        <CardHeader title="Chat">
          <Button onClick={this.handleNewDiscussion} icon="Plus" />
        </CardHeader>
        <TabBar tabs={tabs} onChange={this.handleTabChange} value={tabIndex} />
      </SW.LeftHeaderWrapper>
    );
  }
  render() {
    const { nav } = this.props;
    const { tabIndex, selectedId } = this.state;
    let type = 'following';
    if (tabIndex === 1) {
      type = 'all other';
    }

    return (
      <SW.ProvideContext>
        <SW.ParentWrapper>
          <SW.LeftSide>
            <CardContent header={this.renderLeftHeader()} noframe>
              <DiscussionList
                key={type}
                type={type}
                onSelectItemId={this.onSelectItemId}
              />
            </CardContent>
          </SW.LeftSide>
          <SW.RightSide viewWidth={nav.width}>
            {selectedId && (
              <DiscussionOverview key={selectedId} discussionId={selectedId} />
            )}
          </SW.RightSide>
        </SW.ParentWrapper>
      </SW.ProvideContext>
    );
  }
}
