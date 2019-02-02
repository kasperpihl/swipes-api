import React, { PureComponent } from 'react';
import request from 'swipes-core-js/utils/request';
import { setupLoading } from 'swipes-core-js/classes/utils';
import urlGetParameter from 'src/utils/url/urlGetParameter';
import SW from './Unsubscribe.swiss';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  componentWillMount() {
    const email = urlGetParameter('email');
    const emailType = urlGetParameter('email_type');
    this.setLoading('unsubscribe', 'Unsubscribing...');
    request('users.unsubscribe', {
      email,
      email_type: emailType
    }).then(res => {
      if (res.ok) {
        this.clearLoading(
          'unsubscribe',
          'You have been unsubscribed from these types of emails'
        );
      } else {
        this.clearLoading('unsubscribe', '!Something went wrong');
      }
    });
  }
  render() {
    return (
      <SW.Wrapper>
        <SW.Text>
          {this.getLoading('unsubscribe').loading}
          {this.getLoading('unsubscribe').success}
          {this.getLoading('unsubscribe').error}
        </SW.Text>
      </SW.Wrapper>
    );
  }
}