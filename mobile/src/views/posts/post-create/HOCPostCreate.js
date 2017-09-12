import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { setupLoading, convertObjToUnderscore, navForContext, typeForId } from 'swipes-core-js/classes/utils';
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

    this.onActionButton = this.onActionButton.bind(this);
    this.onModalChangeType = this.onModalChangeType.bind(this);

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
    let { post } = this.state;
    post = post.set('message', text);

    this.setState({ post });
  }
  onModalTag(sortedUsers, data) {
    let { post } = this.state;
    const { showModal } = this.props;
    post = post.setIn(['taggedUsers'], List(data.map(i => sortedUsers.getIn([i, 'id']))));

    this.updatePost(post);

    showModal();
  }
  onModalChangeType(i) {
    const { showModal } = this.props;

    this.setState({ post: this.state.post.set('type', i.get('index')) });

    showModal();
  }
  onTag() {
    const { users, showModal } = this.props;
    let { post } = this.state;

    const userInfoToActions = users.map((u, i) => {
      const selected = this.state.post.get('taggedUsers').indexOf(u.get('id')) > -1;

      const obj = {
        title: `${msgGen.users.getFirstName(u.get('id'))} ${msgGen.users.getLastName(u.get('id'))}`,
        selected,
        index: i,
        leftIcon: {
          user: u.get('id'),
        },
      };

      return fromJS(obj);
    });

    const modal = {
      title: 'Tag teammates',
      onClick: this.onModalTag.bind(this, users),
      multiple: 'Tag',
      items: userInfoToActions,
      fullscreen: true,
    };

    showModal(modal);
  }
  onChangeType() {
    const { showModal } = this.props;

    const modal = {
      title: 'Change type',
      onClick: this.onModalChangeType,
      items: fromJS([
        {
          title: 'Make a post',
          index: 'message',
        },
        {
          title: 'Ask a question',
          index: 'question',
        },
        {
          title: 'Make an announcement',
          index: 'announcement',
        },
        {
          title: 'Share information',
          index: 'information',
        },
      ]),
    };

    showModal(modal);
  }
  onAttachmentClick(i) {
    const { preview } = this.props;
    const { post } = this.state;

    console.log('i get here');


    preview(post.getIn(['attachments', i]));
  }
  onAddAttachment() {
    const { createFile, createLink, loading } = this.props;

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

        loading(true);

        createFile([file]).then((fileRes) => {
          if (fileRes.ok) {
            const link = this.getSwipesLinkObj('file', fileRes.file.id, fileRes.file.title);

            createLink(link).then((res) => {
              loading();
              if (res.ok) {
                const att = fromJS({ link: res.link, title: fileRes.file.title });
                const { post } = this.state;
                this.setState({ post: post.updateIn(['attachments'], (atts) => atts.push(att)) });
              }

            })
          } else {
            loading();
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
    users: cs.users.getActive(state),
  };
}

export default connect(mapStateToProps, {
  createPost: ca.posts.create,
  showModal: a.modals.show,
  loading: a.loading.showLoader,
  createFile: ca.files.create,
  createLink: ca.links.create,
  preview: a.links.preview,
})(HOCPostCreate);
