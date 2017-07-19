import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import {
  setupLoading,
  convertObjToUnderscore,
  navForContext,
  attachmentIconForService,
} from 'swipes-core-js/classes/utils';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import TabMenu from 'context-menus/tab-menu/TabMenu';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import CreatePost from './CreatePost';

class HOCCreatePost extends PureComponent {
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);

    const savedState = props.savedState && props.savedState.get('post');

    this.state = {
      post: savedState || fromJS({
        message: props.message || '',
        type: props.type || 'message',
        attachments: props.attachments || [],
        taggedUsers: props.taggedUsers || [],
        context: props.context || null,
      }),
      fileVal: '',
    };
    setupLoading(this);
  }
  componentDidMount() {

  }
  onAttachmentClick(i) {
    const { post } = this.state;
    const { preview, target } = this.props;

    preview(target, post.getIn(['attachments', i]));
  }
  onSelectAssignees(e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees } = this.props;

    const existingAssignees = this.state.post.get('taggedUsers').toJS();

    selectAssignees(Object.assign({ actionLabel: 'Done' }, options), existingAssignees, (assignees) => {
      let { post } = this.state;
      if (assignees) {
        post = post.set('taggedUsers', fromJS(assignees));
        this.setState({ post });
      }
    });
  }
  onChooseNotificationType(e) {
    const { contextMenu } = this.props;
    const options = this.getOptionsForE(e);

    const items = [
      { icon: 'Status', type: 'message' },
      { icon: 'Feedback', type: 'question' },
      { icon: 'Assets', type: 'announcement' },
      { icon: 'Earth', type: 'information' }
    ].map((i) => {
      i.leftIcon = { icon: i.icon };
      i.title = msgGen.posts.getPostComposeTypeTitle(i.type);
      i.subtitle = msgGen.posts.getPostTypeSubtitle(i.type);
      return i;
    });

    const delegate = {
      onItemAction: (item) => {
        contextMenu(null);
        this.setState({ post: this.state.post.set('type', item.type) });
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
  onAddAttachment() {

  }
  onChangeFiles(e) {
    this.setState({ fileVal: e.target.value });
    this.onUploadFiles(e.target.files);
  }
  onUploadFiles(files) {
    const { createFile } = this.props;
    this.setLoading('attach');
    createFile(files).then((res) => {
      if (res.ok) {
        this.createLinkFromTypeIdTitle('file', res.file.id, res.file.title);
        this.setState({ fileVal: '' });
      } else {
        this.clearLoading('attach', '!Something went wrong');
      }
    });
  }
  onChooseAttachment(e) {
    const { chooseAttachmentType, inputMenu, createNote } = this.props;
    const options = this.getOptionsForE(e);

    chooseAttachmentType(options).then((item) => {
      if (item.id === 'upload') {
        this.refs.create.refs.upload.click();
        return;
      }
      options.buttonLabel = 'Add';
      if (item.id === 'note') {
        options.placeholder = 'Title of the note';
      } else if (item.id === 'url') {
        options.placeholder = 'Enter a URL';
      }
      inputMenu(options, (title) => {
        if (title && title.length) {
          this.setLoading('attach');
          if (item.id === 'url') {
            this.createLinkFromTypeIdTitle(item.id, title, title);
          } else {
            createNote(convertToRaw(EditorState.createEmpty().getCurrentContent())).then((res) => {
              if (res && res.ok) {
                this.createLinkFromTypeIdTitle(item.id, res.note.id, title);
              } else {
                this.clearLoading('attach');
              }
            });
          }
        }
      });
    })
  }
  onTextClick(id, obj, e) {
    let { post } = this.state;
    if (obj.id === 'type') {
      this.onChooseNotificationType(e);
    } else {
      post = post.set('taggedUsers', post.get('taggedUsers').filter(uid => uid !== obj.id));
    }
    this.setState({ post });
  }
  onPostClick(e) {
    const { createPost, navPop } = this.props;
    const { post } = this.state;
    this.setLoading('post');

    createPost(convertObjToUnderscore(post.toJS())).then((res) => {
      if (res.ok) {
        navPop();
      } else {
        this.clearLoading('post', '!Something went wrong');
      }
    })
  }
  onMessageChange(e) {
    let { post } = this.state;
    post = post.set('message', e.target.value);

    this.setState({ post });
  }
  onButtonClick(type, e) {
    if (type === 'type') {
      this.onChooseNotificationType(e);
    } else if (type === 'users') {
      this.onSelectAssignees(e);
    } else if (type === 'attach') {
      this.onChooseAttachment(e);
    }
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    }
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
  createLinkFromTypeIdTitle(type, id, title) {
    const link = this.getSwipesLinkObj(type, id, title);
    const { createLink } = this.props;
    createLink(link).then((res) => {
      this.clearLoading('attach');
      if (res.ok) {
        const att = fromJS({ link: res.link, title });
        const { post } = this.state;
        this.setState({ post: post.updateIn(['attachments'], (atts) => atts.push(att) ) });
        console.log('link created');
      }
    });
  }
  render() {
    const { myId } = this.props;
    const { post, fileVal } = this.state;
    return (
      <CreatePost
        ref="create"
        fileVal={fileVal}
        post={post}
        myId={myId}
        delegate={this}
        {...this.bindLoading() }
      />
    );
  }
}

// const { string } = PropTypes;

HOCCreatePost.propTypes = {};

function mapStateToProps(state) {
  return {
    myId: state.getIn(['me', 'id']),
  };
}

export default navWrapper(connect(mapStateToProps, {
  selectAssignees: a.goals.selectAssignees,
  contextMenu: a.main.contextMenu,
  inputMenu: a.menus.input,
  preview: a.links.preview,
  chooseAttachmentType: a.menus.chooseAttachmentType,
  createPost: ca.posts.create,
  createLink: ca.links.create,
  createNote: ca.notes.create,
  createFile: ca.files.create,
})(HOCCreatePost));
