import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'swiss-react';
import * as ca from 'swipes-core-js/actions';
import { setupLoading, getURLParameter } from 'swipes-core-js/classes/utils';
import styles from './Unsubscribe.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Text = styleElement('div', styles.Text);

class Unsubscribe extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  componentWillMount() {
    const { request } = this.props;
    const email = getURLParameter('email');
    const emailType = getURLParameter('email_type');
    this.setLoading('unsubscribe', 'Unsubscribing...');
    request('users.unsubscribe', {
      email,
      email_type: emailType,
    }).then((res) => {
      if (res.ok) {
        this.clearLoading('unsubscribe', 'You have been unsubscribed from these types of emails');
      } else {
        this.clearLoading('unsubscribe', '!Something went wrong');
      }
    });
  }
  render() {
    return (
      <Wrapper>
        <Text>
          {this.getLoading('unsubscribe').loading}
          {this.getLoading('unsubscribe').success}
          {this.getLoading('unsubscribe').error}
        </Text>
      </Wrapper>
    );
  }
}

export default connect(null, {
  request: ca.api.request,
})(Unsubscribe);
