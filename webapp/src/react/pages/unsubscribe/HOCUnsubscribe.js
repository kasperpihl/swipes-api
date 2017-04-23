import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import './styles/unsubscribe.scss';

class HOCUnsubscribe extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  componentWillMount() {
    const { request } = this.props;
    const email = window.getURLParameter('email');
    const emailType = window.getURLParameter('email_type');
    this.setLoading('unsubscribe', 'Unsubscribing...');
    request('users.unsubscribe', {
      email,
      email_type: emailType,
    }).then((res) => {
      if(res.ok) {
        this.clearLoading('unsubscribe', 'You have been unsubscribed from these types of emails');
      } else {
        this.clearLoading('unsubscribe', '!Something went wrong');
      }
    })
  }
  render() {
    return (
      <div className="unsubscribe">
        {this.getLoading('unsubscribe').loadingLabel}
        {this.getLoading('unsubscribe').successLabel}
        {this.getLoading('unsubscribe').errorLabel}
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCUnsubscribe.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  request: ca.api.request,
})(HOCUnsubscribe);
