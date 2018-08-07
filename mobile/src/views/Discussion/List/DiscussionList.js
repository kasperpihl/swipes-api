import React, { PureComponent } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';
import HOCHeader from 'HOCHeader';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import DiscussionListItem from './Item/DiscussionListItem';
import SW from './DiscussionList.swiss';
import DiscussionListItem from './Item/DiscussionListItem';

@connect(state => ({
  counter: state.counter.get('discussion'),
  myId: state.me.get('id'),
}), {
  apiRequest: ca.api.request,
})
export default class DiscussionList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tabs: ['Following', 'All other', 'By me'],
      tabIndex: 0,
      initLoading: true,
    };

  }
  onInitialLoad = () => {
    const { tabIndex } = this.state;
    const { apiRequest, counter } = this.props;

    if(tabIndex === 0 && counter && counter.size) {
      apiRequest('me.clearCounter', {
        type: 'discussion',
        cleared_at: counter.first().get('ts'),
      });
    }

    this.setState({
      initLoading: false,
    })
  }

  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({
        tabIndex: index,
        initLoading: true,
      });
    }
  }

  onEndReached(p) {
    if (p.hasMore === true) {
      p.loadMore();
    }
  }

  onNewPost = () => {
    const { navPush } = this.props;

    navPush({
      id: 'HOCDiscussionCreate',
      title: 'Create a Discussion',
    })
  }

  renderHeader() {
    const { tabIndex, tabs } = this.state;

    return (
      <HOCHeader
        title="Discuss"
        delegate={this}
        tabs={tabs}
        currentTab={tabIndex}
      >
        <RippleButton onPress={this.onNewPost}>
          <SW.PlusButtonContainer>
            <Icon icon="Plus" width="24" height="24" fill="#333D59" />
          </SW.PlusButtonContainer>
        </RippleButton>
      </HOCHeader>
    );
  }

  renderListFooter = (loading) => {
    if (!loading) return null;

    return (
      <SW.LoaderContainer>
        <ActivityIndicator size="small" color="#007AFF" />
      </SW.LoaderContainer>
    );
  };

  renderEmptyState() {
    return (
      <SW.EmptyStateWrapper>
        <Icon icon="ESDiscussion" width="290" height="300" />
        <SW.EmptyStateText selectable>Start a discussion or share an idea</SW.EmptyStateText>
      </SW.EmptyStateWrapper>
    );
  }

  render() {
    const { tabIndex, initLoading } = this.state;
    const { myId } = this.props;
    let type = 'following';
    let filter = d => d.get('followers').find(o => o.get('user_id') === myId);

    if (tabIndex === 1) {
      type = 'all other';
      filter = d => !d.get('followers').find(o => o.get('user_id') === myId);
    } else if (tabIndex === 2) {
      type = 'by me';
      filter = d => d.get('created_by') === myId;
    }

    return (
      <SW.Wrapper>
        {this.renderHeader()}
        <SW.List>
          <PaginationProvider
            request={{
              body: { type },
              url: 'discussion.list',
              resPath: 'discussions',
            }}
            limit={5}
            onInitialLoad={this.onInitialLoad}
            cache={{
              path: 'discussion',
              filter,
              orderBy: '-last_comment_at',
            }}
          >
            {(p) => {
              if (initLoading) {
                return (
                  <SW.LoaderContainer>
                    <ActivityIndicator size="large" color="#007AFF" />
                  </SW.LoaderContainer>
                )
              }

              if (p.results && !p.results.size) {
                return this.renderEmptyState();
              }

              return (
                <FlatList
                  data={p.results ? p.results.toList().toJS() : []}
                  onEndReached={() => this.onEndReached(p)}
                  onEndReachedThreshold={0}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <DiscussionListItem {...item}></DiscussionListItem>}
                  ListFooterComponent={() => this.renderListFooter(p.loading)}
                />
              );
            }}
          </PaginationProvider>
        </SW.List>
      </SW.Wrapper>
    );
  }
}