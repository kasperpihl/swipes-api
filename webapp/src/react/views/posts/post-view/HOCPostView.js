import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import * as linkActions from 'src/redux/link/linkActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as ca from 'swipes-core-js/actions';
import { navForContext, setupLoading } from 'swipes-core-js/classes/utils';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import PostView from './PostView';

class HOCPostView extends PureComponent {
  static maxWidth() {
    return 600;
  }
  static minWidth() {
    return 600;
  }
  constructor(props) {
    super(props);
    this.state = {};

    setupLoading(this);
  }
  shouldScroll() {
    const { fromFeed } = this.props;

    return !fromFeed;
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  onAttachmentClick(i, att) {
    const { preview, target } = this.props;

    preview(target, att);
  }
  onContextClick() {
    const { openSecondary, post, target } = this.props;
    openSecondary(target, navForContext(post.get('context')));
  }
  onLinkClick(url) {
    const { browser, target } = this.props;
    browser(target, url);
  }
  onOpenPost() {
    const { openSecondary, post, target, fromFeed } = this.props;
    if(fromFeed) {
      openSecondary(target, navForContext(post.get('id')));
    }
  }
  onThreeDotsAction = options => action => {
    action(options).then((res) => {
      if(!res.ok) {
        this.clearLoading('threedots', '!Something went wrong');
      } else {
        this.clearLoading('threedots');
      }
    })
  }
  onThreeDots(e) {
    const { contextMenu, confirm, archivePost, followPost, unfollowPost, post, myId } = this.props;
    const options = this.getOptionsForE(e);
    const items = [];

    if (post.get('followers').includes(myId)) {
      items.push({
        id: 'unfollow',
        title: 'Unfollow',
        subtitle: 'You will no longer receive notifications about this post.',
      })
    } else {
      items.push({
        id: 'follow',
        title: 'Follow',
        subtitle: 'You will start receiving notifications about this post.',
      })
    }

    if (myId === post.get('created_by')) {
      items.push({
        id: 'archive',
        title: 'Delete post',
        subtitle: 'The post will be no longer vissible to anyone in the organization.',
      })
    }

    const delegate = {
      onItemAction: (item) => {
        if (item.id !== 'archive') {
          this.setLoading('threedots');
          
          switch (item.id) {
            case 'unfollow': {
              return this.onThreeDotsAction({
                post_id: post.get('id')
              })(unfollowPost);
            }
            case 'follow': {
              return this.onThreeDotsAction({
                post_id: post.get('id')
              })(followPost);
            }
          }          
        } else {
          confirm(Object.assign({}, options, {
            title: item.title,
            message: 'This cannot be undone. Are you sure?',
          }), (i) => {
            if (i === 1) {
              this.setLoading('threedots');

              return this.onThreeDotsAction({
                post_id: post.get('id')
              })(archivePost);
            }
          });
        }
      },
    };

    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
        style: {
          width: '360px',
        },
      },
    });
  }
  render() {
    const { myId, post, fromFeed } = this.props;

    return (
      <PostView
        fromFeed={fromFeed}
        myId={myId}
        post={post}
        delegate={this}
        {...this.bindLoading()}
      />
    );
  }
}


export default navWrapper(connect((state, props) => ({
  myId: state.getIn(['me', 'id']),
  post: state.getIn(['posts', props.postId]),
}), {
  openSecondary: navigationActions.openSecondary,
  preview: linkActions.preview,
  browser: mainActions.browser,
  confirm: menuActions.confirm,
  contextMenu: mainActions.contextMenu,
  followPost: ca.posts.follow,
  unfollowPost: ca.posts.unfollow,
  archivePost: ca.posts.archive,
})(HOCPostView));
