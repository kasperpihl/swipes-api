import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import {
  setupLoading,
  convertObjToUnderscore,
  navForContext,
  attachmentIconForService,
  throttle,
  typeForId,
} from 'swipes-core-js/classes/utils';

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
        type: props.type || 'post',
        attachments: props.attachments || [],
        taggedUsers: props.taggedUsers || [],
        context: props.context || null,
      }),
    };
    this.throttledSaveState = throttle(this.saveState.bind(this), 500);

    setupLoading(this);
  }
  componentDidMount() {

  }
  onAutoCompleteSelect(item) {
    let { post } = this.state;
    if(!post.get('taggedUsers').contains(item.id)) {
      post = post.updateIn(['taggedUsers'], (taggedUsers) => taggedUsers.push(item.id));
    }
    const msgArr = post.get('message').split('@');
    post = post.set('message', msgArr.slice(0, -1).join('@'));
    this.updatePost(post);
  }
  componentWillUnmount() {
    this.throttledSaveState.clear();
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

  onTextClick(id, obj, e) {
    let { post } = this.state;
    if (obj.id === 'type') {
      this.onChooseNotificationType(e);
    } else {
      this.updatePost(post.set('taggedUsers', post.get('taggedUsers').filter(uid => uid !== obj.id)));
    }

  }
  onPostClick(e) {
    const { createPost, navPop, hideModal } = this.props;
    const { post } = this.state;
    this.setLoading('post');

    createPost(convertObjToUnderscore(post.toJS())).then((res) => {
      if (res.ok) {
        this.clearLoading('post', 'Posted', 1500, () => {
          console.log('clear');
          if(hideModal) {
            hideModal();
          } else {
            navPop();
          }
        });
        window.analytics.sendEvent('Post created', {
          'Type': post.get('type'),
          'Tagged people': post.get('taggedUsers').size,
          'Attachments': post.get('attachments').size,
          'Context type': post.get('context') ? typeForId(post.getIn(['context', 'id'])) : 'No context',
        });
      } else {
        this.clearLoading('post', '!Something went wrong');
      }
    })
  }
  onMessageChange(e) {
    let { post } = this.state;
    post = post.set('message', e.target.value);

    this.updatePost(post);
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
      <CreatePost
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
  preview: a.links.preview,
  createPost: ca.posts.create,
})(HOCCreatePost));
