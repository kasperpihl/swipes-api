import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS, List } from 'immutable';
import { goals } from '../../../swipes-core-js/actions';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
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
    if (this.state.notify.get('assignees') !== prevState.notify.get('assignees')) {
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
  onFlagAttachment(id) {
    let { notify } = this.state;
    if (notify.get('flags').includes(id)) {
      notify = notify.updateIn(['flags'], fl => fl.filter(f => f !== id));
    } else {
      notify = notify.updateIn(['flags'], fl => fl.push(id));
    }
    this.updateHandoff(notify);
  }
  onChangeText(text) {
    this.message = text;
    // this.updateHandoff(notify.set('message', text));
  }
  onModalAction(sortedUsers, data) {
    let { notify } = this.state;
    const { showModal } = this.props;
    notify = notify.setIn(['assignees'], List(data.map(i => sortedUsers.getIn([i, 'id']))));

    this.updateHandoff(notify);
    showModal();
  }
  onAssignUsers() {
    const { users, showModal, } = this.props;
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
      title: 'Assign People',
      onClick: this.onModalAction.bind(this, sortedUsers),
      multiple: 'Assign',
      items: userInfoToActions,
      fullscreen: true,
    };

    showModal(modal);

  }
  onActionButton(index) {
    const { navPop, goal, goalNotify } = this.props;
    let { notify } = this.state;

    if (index === 1) {
      this.setState({ hasLoaded: false });
      notify = notify.set('message', this.message || notify.get('message'));
      goalNotify(goal.get('id'), notify).then((res) => {
        if (res && res.ok) {
          this.setState({ hasLoaded: true });
          navPop();
        } else {
          this.setState({ hasLoaded: true });
        }
      });
    }
  }
  updateHandoff(notify) {
    this.setState({ notify });
  }
  renderActionButtons() {
    const { notify } = this.state;
    let actionButtons = [
      { text: 'Assign people' },
    ];

    if (notify && notify.get('assignees').size) {
      actionButtons = [
        { text: 'Assign people' },
        { text: 'Notify' },
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
