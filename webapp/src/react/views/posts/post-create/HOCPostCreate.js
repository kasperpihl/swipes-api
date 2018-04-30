import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import * as linkActions from 'src/redux/link/linkActions';
import * as goalActions from 'src/redux/goal/goalActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as ca from 'swipes-core-js/actions';

import {
  setupLoading,
  navForContext,
  typeForId
} from 'swipes-core-js/classes/utils';
import convertObjectKeysToUnderscore from 'swipes-core-js/utils/convertObjectKeysToUnderscore';
import getDeep from 'swipes-core-js/utils/getDeep';
import throttle from 'swipes-core-js/utils/throttle';

import { fromJS } from 'immutable';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import PostCreate from './PostCreate';

class HOCPostCreate extends PureComponent {
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);

    const savedState = props.savedState && props.savedState.get('post');

    this.state = {
      editorState: null,
      post: savedState || fromJS({
        message: props.message || '',
        attachments: props.attachments || [],
        taggedUsers: props.taggedUsers || [],
        context: props.context || null,
      }),
    };
    this.throttledSaveState = throttle(this.saveState.bind(this), 500);

    setupLoading(this);
  }
  componentWillUnmount() {
    this.throttledSaveState.clear();
  }
  onAutoCompleteSelect(item) {
    let { post } = this.state;
    if(!post.get('taggedUsers').contains(item.id)) {
      post = post.updateIn(['taggedUsers'], (taggedUsers) => taggedUsers.push(item.id));
    }
    this.updatePost(post);
  }
  onAttachmentClick(i) {
    const { preview, target } = this.props;
    const { post } = this.state;
    preview(target, post.getIn(['attachments', i]));
  }
  onAttachmentClose(i) {
    this.updatePost(this.state.post.updateIn(['attachments'], atts => atts.delete(i)));
  }
  onContextClose() {
    this.updatePost(this.state.post.set('context', null));
  }
  onFocus = () => {
    const input = getDeep(this, 'refs.create.refs.composer.refs.textarea.refs.textarea');
    if(input) {
      input.focus()
    }
  }
  onAssign(i, e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees } = this.props;

    const existingAssignees = this.state.post.get('taggedUsers').toJS();


    selectAssignees(Object.assign({
      onClose: this.onFocus,
    }, options), existingAssignees, (assignees) => {
      let { post } = this.state;
      if (assignees) {
        this.updatePost(post.set('taggedUsers', fromJS(assignees)));
      }
    });
  }
  onChooseNotificationType(e) {
    const { contextMenu } = this.props;
    const options = this.getOptionsForE(e);

    const items = [
      { icon: 'MessageColored', type: 'post' },
      { icon: 'QuestionColored', type: 'question' },
      { icon: 'AnnouncementColored', type: 'announcement' },
      { icon: 'InformationColored', type: 'information' }
    ].map((i) => {
      i.leftIcon = { icon: i.icon };
      i.title = msgGen.posts.getPostComposeTypeTitle(i.type);
      i.subtitle = msgGen.posts.getPostTypeSubtitle(i.type);
      return i;
    });

    const delegate = {
      onItemAction: (item) => {
        contextMenu(null);
        this.updatePost(this.state.post.set('type', item.type));
      },
    };
    contextMenu({
      options,
      onClose: this.onFocus,
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

  onContextClick() {
    const { openSecondary, target } = this.props;
    const { post } = this.state;
    openSecondary(target, navForContext(post.get('context')));
  }

  onPostClick(e) {
    const { createPost, navPop, hideModal } = this.props;
    let { post } = this.state;
    if(!this.editorState) return;
    const message = this.editorState.getCurrentContent().getPlainText();
    if(!message.length) return;
    post = post.set('message', message);
    this.setLoading('post');

    createPost(convertObjectKeysToUnderscore(post.toJS())).then((res) => {
      if (res.ok) {
        this.clearLoading('post', 'Posted', 1500, () => {
          if(hideModal) {
            hideModal();
          } else {
            navPop();
          }
        });
        window.analytics.sendEvent('Post created', {
          'Tagged people': post.get('taggedUsers').size,
          'Attachments': post.get('attachments').size,
          'Context type': post.get('context') ? typeForId(post.getIn(['context', 'id'])) : 'No context',
        });
      } else {
        this.clearLoading('post', '!Error', 3000);
      }
    })
  }
  onMessageChange(editorState) {
    this.editorState = editorState;
  }
  onAttachButtonCloseOverlay() {
    this.onFocus();
  }
  onAddedAttachment(att) {
    const { post } = this.state;
    this.updatePost(post.updateIn(['attachments'], (atts) => atts.push(att) ));
  }
  updatePost(post) {
    this.setState({ post }, () => {
      this.throttledSaveState();
    });
  }
  saveState() {
    const { post } = this.state;
    const { saveState } = this.props;
    saveState({ post });
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    }
  }

  render() {
    const { myId, hideModal } = this.props;
    const { post } = this.state;

    return (
      <PostCreate
        ref="create"
        hideModal={hideModal}
        post={post}
        myId={myId}
        delegate={this}
        {...this.bindLoading() }
      />
    );
  }
}

export default navWrapper(connect(state => ({
  myId: state.getIn(['me', 'id']),
}), {
  openSecondary: navigationActions.openSecondary,
  selectAssignees: goalActions.selectAssignees,
  contextMenu: mainActions.contextMenu,
  preview: linkActions.preview,
  createPost: ca.posts.create,
})(HOCPostCreate));
