import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import moment from 'moment';
import HOCAssigning from 'components/assigning/HOCAssigning';
import * as a from 'actions';
/* global msgGen */

import './styles/last-update.scss';

class HOCLastUpdate extends PureComponent {
  slackUserIdForUser(uId) {
    switch (uId) {
      case 'UB9BXJ1JB': // yana
        return 'U02S15YG9';
      case 'URU3EUPOE': // stefan
        return 'U02H991H2';
      case 'USTFL9YVE': // tihomir
        return 'U0B119T8W';
      case 'UVZWCJDHK': // kasper
        return 'U02A53ZUL';
      case 'UZTYMBVGO': // kristjan
        return 'U09KBMX7Z';
      default:
        return 'USLACKBOT';
    }
  }
  clickedAssign() {
    const { handoff } = this.props;
    const { openSlackIn, navSet } = this.props;
    navSet('primary', 'slack');
    openSlackIn(this.slackUserIdForUser(handoff.get('done_by')));
  }
  renderMessage(handoff) {
    if (handoff.get('message') && handoff.get('message').length) {
      return (
        <div className="last-update__message">
          &bdquo;{handoff.get('message')}&ldquo;
        </div>
      );
    }
    return undefined;
  }
  renderImage(handoff) {
    return (
      <HOCAssigning delegate={this} assignees={[handoff.get('done_by')]} />
    );
  }
  renderLabel(handoff) {
    let string = msgGen.getUserString(handoff.get('done_by'));
    switch (handoff.get('type')) {
      case 'complete_goal':
        string += ' completed this goal';
        break;
      case 'created':
        string += ' created this goal';
        break;
      case 'complete_step':
        string += ' completed the previous step';
        break;
      default:
        break;
    }
    string += ` ${moment(handoff.get('done_at')).fromNow()}`;
    return (
      <div className="last-update__label">
        {string}
      </div>
    );
  }
  render() {
    const { handoff } = this.props;

    return (
      <div className="last-update">
        <div className="last-update__header">
          {this.renderImage(handoff)}
          {this.renderLabel(handoff)}
        </div>
        {this.renderMessage(handoff)}
      </div>
    );
  }
}
const { func } = PropTypes;

HOCLastUpdate.propTypes = {
  handoff: map.isRequired,
  openSlackIn: func,
  navSet: func,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  openSlackIn: a.main.openSlackIn,
  navSet: a.navigation.set,
})(HOCLastUpdate);
