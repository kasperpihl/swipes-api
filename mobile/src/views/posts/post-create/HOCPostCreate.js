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
import moment from 'moment';
import mime from 'react-native-mime-types';
import ImagePicker from 'react-native-image-picker';
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

    bindAll(this, ['onModalTag', 'onModalChangeType', 'onActionButton', 'onModalDismiss']);

  }
  componentDidMount() {
    this.renderActionButtons();
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.isActive && this.props.isActive || !prevState.post.get('type') !== this.state.post.get('type')) {
      this.renderActionButtons();
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
      this.onAddAttachment();
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
  onModalDismiss() {
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
    }, { onDidClose: this.onModalDismiss });
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
    }, { onDidClose: this.onModalDismiss });
  }
  onAttachmentClick(i) {
    const { preview } = this.props;
    const { post } = this.state;

    preview(post.getIn(['attachments', i]));
  }
  onAddAttachment() {
    const { createFile, createLink, showLoading } = this.props;

    const options = {
      title: 'Attach image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const type = mime.lookup(response.uri) || 'application/octet-stream';
        const ext = mime.extension(type);
        const name = response.fileName
          || `Photo ${moment().format('MMMM Do YYYY, h:mm:ss a')}.${ext}`;
        const file = {
          name,
          uri: response.uri,
          type,
        };

        showLoading('Uploading');

        createFile([file]).then((fileRes) => {
          if (fileRes.ok) {
            const link = this.getSwipesLinkObj('file', fileRes.file.id, fileRes.file.title);

            createLink(link).then((res) => {
              showLoading();
              if (res.ok) {
                const att = fromJS({ link: res.link, title: fileRes.file.title });
                const { post } = this.state;
                this.setState({ post: post.updateIn(['attachments'], (atts) => atts.push(att)) });
              }

            })
          } else {
            showLoading();
          }
        });
      }
    });
  }
  getSwipesLinkObj(type, id, title) {
    const { myId } = this.props;
    return {
      service: {
        name: 'swipes',
        type,
        id,
      },
      permission: {
        account_id: myId,
      },
      meta: {
        title,
      },
    };
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
    actionButtons = [
      { icon: 'Assign' },
      { icon: this.getIconForType() },
      { icon: 'Attachment' },
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
  actionModal: a.modals.action,
  assignModal: a.modals.assign,
  showLoading: a.main.loading,
  createFile: ca.files.create,
  createLink: ca.links.create,
  preview: a.links.preview,
})(HOCPostCreate);
