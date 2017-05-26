import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { goals } from '../../../swipes-core-js/actions';
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
    };

    this.onActionButton = this.onActionButton.bind(this);
    this.onModalAction = this.onModalAction.bind(this);
  }
  componentDidMount() {
    this.renderActionButtons();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.notify.get('assignees') !== prevState.notify.get('assignees')) {
      this.renderActionButtons();
    }
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
  onChangeText(event) {
    const text = event.nativeEvent.text;
    const { notify } = this.state;
    this.updateHandoff(notify.set('message', text));
  }
  onModalAction(data) {
    let { notify } = this.state;
    const { showModal } = this.props;

    notify = notify.setIn(['assignees'], data.toJS());

    this.updateHandoff(notify);
    showModal();
  }
  onActionButton(index) {
    const { users, showModal, navPop, goal, goalNotify } = this.props;
    const { notify } = this.state;

    const sortedUsers = users.sort(
      (b, c) => msgGen.users.getFirstName(b).localeCompare(msgGen.users.getFirstName(c)),
    );

    const userInfoToActions = sortedUsers.map((u, i) => {
      const selected = this.state.notify.get('assignees').indexOf(u.get('id')) === 0;

      const obj = {
        title: `${msgGen.users.getFirstName(u.get('id'))} ${msgGen.users.getLastName(u.get('id'))}`,
        selected,
        index: i,
        leftIcon: {
          user: u.get('id'),
        },
      };

      return obj;
    });

    if (index === 0) {
      const modal = {
        title: 'Assign People',
        onClick: this.onModalAction,
        multiple: 'Assign',
        items: userInfoToActions,
      };

      showModal(modal);
    } else if (index === 1) {
      goalNotify(goal.get('id'), notify).then((res) => {
        if (res && res.ok) {
          navPop();
        } else {
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

    if (notify && notify.get('assignees').length) {
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
    const { notify } = this.state;

    return <Notify me={me} goal={goal} delegate={this} notify={notify} />;
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
