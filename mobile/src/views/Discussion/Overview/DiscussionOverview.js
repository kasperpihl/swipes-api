import React, { PureComponent, Fragment } from "react";
import { FlatList, ActivityIndicator } from "react-native";
import * as ca from "swipes-core-js/actions";
import { connect } from "react-redux";
import DiscussionHeader from "views/Discussion/Header/DiscussionHeader";
import ContextButton from "views/Discussion/ContextButton/ContextButton";
import withRequests from "swipes-core-js/components/withRequests";
import PaginationProvider from "swipes-core-js/components/pagination/PaginationProvider";
import SW from "./DiscussionOverview.swiss";
import CommentItem from "views/Comment/Item/CommentItem";
import CommentComposer from "views/Comment/Composer/CommentComposer";
import { setupLoading } from "swipes-core-js/classes/utils";
import { mobileNavForContext } from "utils/utils";

@withRequests({
  discussion: {
    request: {
      url: "discussion.get",
      body: props => ({
        discussion_id: props.discussionId
      }),
      resPath: "discussion"
    },
    cache: {
      path: props => ["discussion", props.discussionId]
    }
  }
})
@connect(
  state => ({
    myId: state.me.get("id")
  }),
  {
    apiRequest: ca.api.request
  }
)
export default class DiscussionOverview extends PureComponent {
  static sizes() {
    return [654];
  }
  constructor(props) {
    super(props);

    this.state = {
      initLoading: true
    };

    setupLoading(this);
    this.onNavigateToContext = this.onNavigateToContext.bind(this);
  }
  componentDidMount() {
    this.hideActionBar();
  }
  componentWillUpdate(nextProps) {
    if (nextProps.isActive && !this.props.isActive) {
      this.hideActionBar();
    }
  }
  onInitialLoad = () => {
    const { discussion, myId, apiRequest } = this.props;
    const sub = discussion
      .get("followers")
      .find(f => f.get("user_id") === myId);

    if (
      sub &&
      (!sub.get("read_at") ||
        sub.get("read_at") < discussion.get("last_comment_at"))
    ) {
      apiRequest("discussion.markAsRead", {
        read_at: discussion.get("last_comment_at"),
        discussion_id: discussion.get("id")
      });
    }

    this.setState({
      initLoading: false
    });
  };
  onEndReached(p) {
    if (p.hasMore === true) {
      p.loadMore();
    }
  }
  renderListFooter = loading => {
    if (!loading) return null;

    return (
      <SW.LoaderContainer>
        <ActivityIndicator size="small" color="#007AFF" />
      </SW.LoaderContainer>
    );
  };
  hideActionBar() {
    const { setActionButtons } = this.props;

    setActionButtons({
      hide: true
    });
  }
  onNavigateToContext() {
    const { discussion, navPush } = this.props;
    const context = discussion.get("context");

    if (context) {
      navPush(mobileNavForContext(context));
    }
  }
  render() {
    const { discussion, navPush, navPop } = this.props;
    const { initLoading } = this.state;

    if (!discussion) {
      return null;
    }

    return (
      <Fragment>
        <DiscussionHeader {...discussion.toJS()} {...this.bindLoading()} />
        <ContextButton
          {...discussion.toJS()}
          onNavigateToContext={this.onNavigateToContext}
        />
        <PaginationProvider
          request={{
            body: {
              discussion_id: discussion.get("id")
            },
            url: "comment.list",
            resPath: "comments"
          }}
          onInitialLoad={this.onInitialLoad}
          cache={{
            path: ["comment", discussion.get("id")],
            orderBy: "-sent_at"
          }}
        >
          {p => {
            if (initLoading) {
              return (
                <SW.LoaderContainer>
                  <ActivityIndicator size="large" color="#007AFF" />
                </SW.LoaderContainer>
              );
            }

            return (
              <FlatList
                data={p.results ? p.results.toList().toJS() : []}
                onEndReached={() => this.onEndReached(p)}
                onEndReachedThreshold={0}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <CommentItem {...item} />}
                ListFooterComponent={() => this.renderListFooter(p.loading)}
                inverted={true}
              />
            );
          }}
        </PaginationProvider>
        <CommentComposer
          navPush={navPush}
          navPop={navPop}
          discussionId={discussion.get("id")}
          placeholder="Write a comment…"
          {...this.bindLoading()}
        />
      </Fragment>
    );
  }
}
