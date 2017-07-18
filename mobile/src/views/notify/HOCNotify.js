import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { fromJS, List } from 'immutable';
import { goals } from '../../../swipes-core-js/actions';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { attachmentIconForService } from '../../../swipes-core-js/classes/utils';
import * as a from '../../actions';
import Notify from './Notify';

class HOCNotify extends PureComponent {
  constructor(props) {
    super(props);
    const notify = fromJS(props.notify) || fromJS({});

    this.state = {
      notify: fromJS({
        flags: notify.get('flags') || [],
        reply_to: notify.get('reply_to') || null,
        assignees: notify.get('assignees') || [],
        message: notify.get('message') || '',
        request: notify.get('request') || false,
        notification_type: notify.get('notification_type') || 'update',
      }),
      routeNum: props.lastRoute,
      hasLoaded: false,
    };

    const helper = this.getHelper();
    if (typeof notify.get('reply_to') === 'number') {
      this.state.replyObj = helper.getActivityByIndex(notify.get('reply_to'));
    }

    this.onActionButton = this.onActionButton.bind(this);
    this.onModalAction = this.onModalAction.bind(this);
  }
  componentDidMount() {
    this.renderActionButtons();
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.notify.get('assignees') !== prevState.notify.get('assignees') || this.state.notify.get('flags') !== prevState.notify.get('flags')) {
      this.renderActionButtons();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  onOpenAttachment(att) {
    const { preview } = this.props;
    preview(att);
  }
  onFlagAttachments(attachments, ids) {
    let { notify } = this.state;
    const { showModal } = this.props;

    const flags = [];

    ids.map(i => {
      const attId = attachments.getIn([i, 'index']);
      flags.push(attId);
    });

    notify.get('flags').map((fl, i) => {
      if (flags.indexOf(fl) < 0) {
        notify = notify.deleteIn(['flags', i]);
      }
    });

    ids.map(i => {
      const attId = attachments.getIn([i, 'index']);

      if (!notify.get('flags').includes(attId)) {
        notify = notify.updateIn(['flags'], fl => fl.push(attId));
      }
    });

    this.updateHandoff(notify);
    showModal();
  }
  onChangeText(text) {
    this.message = text;
  }
  onModalAction(sortedUsers, data) {
    let { notify } = this.state;
    const { showModal } = this.props;
    notify = notify.setIn(['assignees'], List(data.map(i => sortedUsers.getIn([i, 'id']))));

    this.updateHandoff(notify);
    showModal();
  }
  onAssignUsers() {
    const { users, showModal } = this.props;
    let { notify } = this.state;

    const sortedUsers = users.sort(
      (b, c) => msgGen.users.getFirstName(b).localeCompare(msgGen.users.getFirstName(c)),
    ).toList();

    const userInfoToActions = sortedUsers.map((u, i) => {
      const selected = this.state.notify.get('assignees').indexOf(u.get('id')) > -1;

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
      title: 'Assign teammates',
      onClick: this.onModalAction.bind(this, sortedUsers),
      multiple: 'Assign',
      items: userInfoToActions,
      fullscreen: true,
    };

    showModal(modal);

  }
  onActionButton(index) {
    const { navPop, goal, goalNotify, showModal } = this.props;
    let { notify } = this.state;
    const attachmentOrder = goal.get('attachment_order');
    const attachments = goal.get('attachments');

    if (index === 0) {
      const attachmentsUi = attachmentOrder.map((att, i) => {
        const at = attachments.get(att);
        const icon = attachmentIconForService(at.getIn(['link', 'service']) || at);
        const isFlagged = notify.get('flags').contains(at.get('id'));

        const obj = {
          title: at.get('title'),
          selected: isFlagged,
          index: at.get('id'),
          leftIcon: {
            icon: icon,
          },
        };

        return fromJS(obj);
      })

      const modal = {
        title: 'Attach Files',
        onClick: this.onFlagAttachments.bind(this, attachmentsUi),
        multiple: 'Attach',
        items: attachmentsUi,
        fullscreen: true,
      };

      showModal(modal);

    } else if (index === 1) {
      notify = notify.set('message', this.message || notify.get('message'));

      if (notify.get('message').length) {
        this.setState({ hasLoaded: false });
        goalNotify(goal.get('id'), notify).then((res) => {
          if (res && res.ok) {
            this.setState({ hasLoaded: true });
            window.analytics.sendEvent('Notification sent', {
              Request: !!notify.get('request'),
              Type: notify.get('notification_type'),
              Reply: !!(typeof notify.get('reply_to') === 'number'),
            });
            navPop();
          } else {
            this.setState({ hasLoaded: true });
          }
        });
      } else {
        Alert.alert(
          'Can\'t send message',
          'You must enter text to send this message',
          [
            { text: 'OK', onPress: () => console.log('Ask me later pressed') },
          ],
          { cancelable: false }
        )
      }

    }
  }
  updateHandoff(notify) {
    this.setState({ notify });
  }
  renderActionButtons() {
    const { notify } = this.state;
    const attachLable = notify.get('flags').size > 0 ? `Attach files (${notify.get('flags').size})` : 'Attach files';

    let actionButtons = [
      { text: attachLable },
    ];

    if (notify && notify.get('assignees').size) {
      actionButtons = [
        { text: attachLable },
        { icon: 'Send' },
      ];
    }

    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: actionButtons,
    });
  }
  render() {
    const { me, goal } = this.props;
    const { notify, hasLoaded, replyObj } = this.state;

    return <Notify me={me} hasLoaded={hasLoaded} goal={goal} delegate={this} notify={notify} replyObj={replyObj} />;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
    users: state.get('users'),
  };
}

export default connect(mapStateToProps, {
  preview: a.links.preview,
  showModal: a.modals.show,
  goalNotify: goals.notify,
})(HOCNotify);
