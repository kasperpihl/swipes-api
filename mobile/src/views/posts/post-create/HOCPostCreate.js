import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from '../../../actions';
import * as ca from '../../../../swipes-core-js/actions';
import { setupLoading, convertObjToUnderscore, navForContext } from '../../../../swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
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
      routeNum: props.lastRoute,
    };

    this.onActionButton = this.onActionButton.bind(this);
    this.onModalChangeType = this.onModalChangeType.bind(this);

  }
  componentDidMount() {
    this.renderActionButtons();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.routeNum !== this.props.routeNum && this.props.routeNum === this.state.routeNum) {
      this.renderActionButtons();
    }
  }
  onActionButton(i) {
    const { post } = this.state;
    const { createPost, navPop } = this.props;

    if (i === 0) {
      createPost(convertObjToUnderscore(post.toJS())).then((res) => {
        if (res.ok) {
          navPop();
        } else {

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

    const sortedUsers = users.sort(
      (b, c) => msgGen.users.getFirstName(b).localeCompare(msgGen.users.getFirstName(c)),
    ).toList();

    const userInfoToActions = sortedUsers.map((u, i) => {
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
      onClick: this.onModalTag.bind(this, sortedUsers),
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
          title: 'Send a message',
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
  onAddAttachment() {

  }
  updatePost(post) {
    this.setState({ post });
  }
  renderActionButtons() {
    actionButtons = [
      { icon: 'Send', align: 'right' },
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
    users: state.get('users'),
  };
}

export default connect(mapStateToProps, {
  createPost: ca.posts.create,
  showModal: a.modals.show,
})(HOCPostCreate);
