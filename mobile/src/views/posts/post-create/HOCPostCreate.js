import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import {
  setupLoading,
  typeForId,
  bindAll,
} from 'swipes-core-js/classes/utils';
import convertObjectKeysToUnderscore from 'swipes-core-js/utils/convertObjectKeysToUnderscore';
import getDeep from 'swipes-core-js/utils/getDeep';

import { fromJS, List } from 'immutable';
import PostCreate from './PostCreate';

class HOCPostCreate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      post: fromJS({
        message: props.message || '',
        attachments: props.attachments || [],
        taggedUsers: props.taggedUsers || [],
        context: props.context || null,
      }),
    };

    bindAll(this, [
      'onModalTag',
      'onActionButton',
      'onFocusTextarea',
      'handleAttach',
      'onChooseAttachmentTypeToAdd',
      'onAddAttachment',
    ]);

    setupLoading(this);
  }
  componentDidMount() {
    this.renderActionButtons();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isActive) {
      if (!prevProps.isActive) this.onFocusTextarea();

      const { post } = this.state;
      const prevPost = prevState.post;
      if (!prevProps.isActive ||
          prevPost.get('attachments').size !== post.get('attachments').size) {
        this.renderActionButtons();
      }
    }
  }
  onActionButton(i) {
    const { post } = this.state;
    const { createPost, navPop } = this.props;

    if (i === 0) {
      this.onTag();
    } else if (i === 1) {
      this.onChooseAttachmentTypeToAdd();
    } else if (i === 2) {
      if (this.isLoading('posting')) {

      } else {
        this.setLoading('posting');
        this.renderActionButtons();
        createPost(convertObjectKeysToUnderscore(post.toJS())).then((res) => {
          this.clearLoading('posting');
          this.renderActionButtons();
          if (res.ok) {
            window.analytics.sendEvent('Post created', {
              'Tagged people': post.get('taggedUsers').size,
              Attachments: post.get('attachments').size,
              'Context type': post.get('context') ? typeForId(post.getIn(['context', 'id'])) : 'No context',
            });
            navPop();
          }
        });
      }
    }
  }
  onMessageChange(text) {
    const { post } = this.state;
    this.updatePost(post.set('message', text));
  }
  onModalTag(selectedIds) {
    const { post } = this.state;
    this.updatePost(post.setIn(['taggedUsers'], selectedIds));
  }
  onFocusTextarea() {
    const input = getDeep(this, 'refs.postCreate.refs.input');
    if (input) {
      input.focus();
    }
  }
  onTag() {
    const { assignModal } = this.props;
    const { post } = this.state;
    Keyboard.dismiss();
    assignModal({
      title: 'Tag teammates',
      actionLabel: 'Tag',
      selectedIds: post.get('taggedUsers'),
      onActionPress: this.onModalTag,
    }, { onDidClose: this.onFocusTextarea });
  }
  onAttachmentClick(i) {
    const { preview } = this.props;
    const { post } = this.state;

    preview(post.getIn(['attachments', i]));
  }
  onChooseAttachmentTypeToAdd() {
    const { actionModal, navPush } = this.props;
    const { post } = this.state;
    const attachments = post.get('attachments');

    if (attachments.size) {
      navPush({
        id: 'AttachmentView',
        title: 'Attachment',
        props: {
          delegate: this,
          initialAttachments: attachments,
        },
      });
    } else {
      Keyboard.dismiss();
      actionModal({
        title: 'Add attachment',
        onItemPress: this.onAddAttachment,
        items: fromJS([
          { id: 'url', title: 'Add a URL' },
          { id: 'image', title: 'Upload an image' },
        ]),
      }, { onDidClose: this.onFocusTextarea });
    }
  }
  onAddAttachment(id) {
    const { uploadAttachment } = this.props;

    uploadAttachment(id, this.handleAttach, this.onFocusTextarea);
  }
  handleAttach(att) {
    const { post } = this.state;
    this.setState({ post: post.updateIn(['attachments'], atts => atts.push(att)) });
    this.onFocusTextarea();
  }

  updatePost(post) {
    this.setState({ post });
  }
  renderActionButtons() {
    const { post } = this.state;
    const size = post.get('attachments').size;

    const sendIcon = this.isLoading('posting') ? 'loading' : 'Send';

    actionButtons = [
      { icon: 'Assign' },
      size ? { number: size } : { icon: 'Attachment' },
      { icon: sendIcon, seperator: 'left', staticSize: true },
    ];

    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: actionButtons,
    });
  }
  render() {
    const { myId } = this.props;
    const { post } = this.state;

    return (
      <PostCreate
        ref="postCreate"
        post={post}
        myId={myId}
        delegate={this}
      />
    );
  }
}

// const { string } = PropTypes;

HOCPostCreate.propTypes = {};

function mapStateToProps(state) {
  return {
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  createPost: ca.posts.create,
  uploadAttachment: a.attachments.upload,
  createLink: ca.links.create,
  actionModal: a.modals.action,
  assignModal: a.modals.assign,
  promptModal: a.modals.prompt,
  preview: a.attachments.preview,
})(HOCPostCreate);
