import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import * as a from '../../actions';
import Notify from './Notify';

class HOCNotify extends Component {
  constructor(props) {
    super(props);
    const notify = props.notify || fromJS({});

    this.state = {
      notify: fromJS({
        flags: notify.get('flags') || [],
        reply_to: notify.get('reply_to') || null,
        assignees: notify.get('assignees') || [],
        message: notify.get('message') || '',
        request: notify.get('request') || false,
        notification_type: notify.get('notification_type') || 'update',
      }),
    };
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
  updateHandoff(notify) {
    this.setState({ notify });
  }
  render() {
    const { me, goal } = this.props;
    const { notify } = this.state;

    return <Notify me={me} goal={goal} delegate={this} notify={notify} />
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  preview: a.links.preview,
})(HOCNotify);
