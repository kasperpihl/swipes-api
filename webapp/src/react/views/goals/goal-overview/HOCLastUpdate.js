import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { map, list } from 'react-immutable-proptypes';
import moment from 'moment';
import HOCAssigning from 'components/assigning/HOCAssigning';
/* global msgGen */

class HOCLastUpdate extends PureComponent {
  renderMessage(handoff) {
    if (handoff.get('message') && handoff.get('message').length) {
      return (
        <div className="last-update--message">
          {handoff.get('message')}
        </div>
      );
    }
  }
  renderImage(handoff) {
    return (
      <HOCAssigning assignees={[handoff.get('done_by')]} />
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
      <div className="last-update--label">
        {string}
      </div>
    );
  }
  render() {
    const { handoff } = this.props;

    return (
      <div className="last-update">
        {this.renderMessage(handoff)}
        {this.renderImage(handoff)}
        {this.renderLabel(handoff)}
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCLastUpdate.propTypes = {
  handoff: map.isRequired,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(HOCLastUpdate);
