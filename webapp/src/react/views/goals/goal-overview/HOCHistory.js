import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
// import * as a from 'actions';
import { map } from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import NotificationWrapper from '../../dashboard/NotificationWrapper';
/* global msgGen */

class HOCHistory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  getAttachments(flags) {
    const { goal } = this.props;
    if (!flags || !goal.get('attachments')) {
      return undefined;
    }
    const at = flags.map(fId => (goal.getIn(['attachments', fId, 'title']))).filter(v => !!v);
    return fromJS(at);
  }
  getStepTitle(stepId) {
    const { goal } = this.props;
    return goal.getIn(['steps', stepId, 'title']);
  }
  getNotificationForEvent(e) {
    const { me } = this.props;
    const type = e.get('type');
    let m = Map({
      timeago: moment(e.get('done_at')).fromNow(),
      seen: true,
      message: e.get('message'),
      attachments: this.getAttachments(e.get('flags')),
    });
    const stepTitle = this.getStepTitle(e.get('to'));
    const from = msgGen.getUserString(e.get('done_by'));
    const to = e.get('done_by') === me.get('id') ? 'yourself' : 'you';

    switch (type) {
      case 'created': {
        m = m.set('subtitle', `${from} kicked off this goal with`);
        m = m.set('title', stepTitle);
        m = m.set('icon', 'Plus');
        break;
      }
      case 'notified': {
        m = m.set('subtitle', `${from} notified ${to} regarding`);
        m = m.set('title', stepTitle);
        m = m.set('icon', 'GotNotified');
        break;
      }
      case 'complete_step': {
        m = m.set('subtitle', `${from} handed off work to ${to}`);
        m = m.set('title', stepTitle);
        m = m.set('icon', 'GotAssigned');
        break;
      }
      case 'complete_goal': {
        m = m.set('subtitle', `${from} completed this goal`);
        m = m.set('icon', 'Star');
        break;
      }
      default:
        break;
    }
    return m;
  }
  renderEvent(e, i) {
    const { me } = this.props;
    if (e.get('type') === 'notified') {
      if (e.get('assignees').indexOf(me.get('id')) === -1) {
        return undefined;
      }
    }
    return (
      <NotificationWrapper
        key={i}
        i={i}
        delegate={this}
        notification={this.getNotificationForEvent(e)}
      />
    );
  }
  render() {
    const { goal } = this.props;
    const history = goal.get('history');
    return (
      <div className="history">
        {history.map((e, i) => this.renderEvent(e, i)).reverse()}
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCHistory.propTypes = {
  goal: map,
  me: map,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
})(HOCHistory);
