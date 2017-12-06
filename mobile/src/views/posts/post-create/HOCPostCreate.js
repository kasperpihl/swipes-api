import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { 
  setupLoading, 
  convertObjToUnderscore, 
  navForContext, 
  typeForId,
  bindAll,
  getDeep,
} from 'swipes-core-js/classes/utils';

import { fromJS, List } from 'immutable';
import PostCreate from './PostCreate';

class HOCPostCreate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      post: fromJS({
        message: props.message || '',
        type: props.type || 'message',
        attachments: props.attachments || [],
        taggedUsers: props.taggedUsers || [],
        context: props.context || null,
      }),
    };

    bindAll(this, [
      'onModalTag',
      'onModalChangeType',
      'onActionButton',
      'onFocusTextarea',
      'handleAttach',
      'onChooseAttachmentTypeToAdd',
      'onAddAttachment'
    ]);

  }
  componentDidMount() {
    console.log('mount');
    this.renderActionButtons();
  }
  componentDidUpdate(prevProps, prevState) {
    if(this.props.isActive) {
      if(!prevProps.isActive) this.onFocusTextarea();

      const { post } = this.state;
      const prevPost = prevState.post;
      if(!prevProps.isActive ||
          prevPost.get('type') !== post.get('type') || 
          prevPost.get('attachments').size !== post.get('attachments').size) {
        console.log('on update');
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
      this.onChangeType();
    } else if (i === 2) {
      this.onChooseAttachmentTypeToAdd();
    } else if (i === 3) {
      createPost(convertObjToUnderscore(post.toJS())).then((res) => {
        if (res.ok) {
          window.analytics.sendEvent('Post created', {
            'Type': post.get('type'),
            'Tagged people': post.get('taggedUsers').size,
            'Attachments': post.get('attachments').size,
            'Context type': post.get('context') ? typeForId(post.getIn(['context', 'id'])) : 'No context',
          });
          navPop();
        }
      })
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
  onModalChangeType(id) {
    const { post } = this.state;
    this.updatePost(post.set('type', id));
  }
  onFocusTextarea() {
    const input = getDeep(this, 'refs.postCreate.refs.input');
    if(input) {
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
  onChangeType() {
    const { actionModal } = this.props;
    Keyboard.dismiss();
    actionModal({
      title: 'Change type',
      onItemPress: this.onModalChangeType,
      items: fromJS([
        { id: 'message', title: 'Make a post' },
        { id: 'question', title: 'Ask a question' },
        { id: 'announcement', title: 'Make an announcement' },
        { id: 'information', title: 'Share information' },
      ]),
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
          initialAttachments: attachments
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
    this.setState({ post: post.updateIn(['attachments'], (atts) => atts.push(att)) });
    this.onFocusTextarea();
  }

  updatePost(post) {
    this.setState({ post });
  }
  getIconForType() {
    const type = this.state.post.get('type');

    switch (type) {
      case 'message': return 'MessageMono';
      case 'question': return 'QuestionMono';
      case 'announcement': return 'AnnouncementMono';
      case 'information': return 'InformationMono';
      default: return 'MessageColored';
    }
  }
  renderActionButtons() {
    const { post } = this.state;
    const size = post.get('attachments').size;

    actionButtons = [
      { icon: 'Assign' },
      { icon: this.getIconForType() },
      size ? { number: size } : { icon: 'Attachment' },
      { icon: 'Send', seperator: 'left', staticSize: true },
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
