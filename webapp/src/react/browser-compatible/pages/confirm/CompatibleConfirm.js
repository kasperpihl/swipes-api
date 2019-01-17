import React, { PureComponent } from 'react';
import { setupLoading } from 'swipes-core-js/classes/utils';
import urlGetParameter from 'src/utils/url/urlGetParameter';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import request from 'swipes-core-js/utils/request';
import CompatibleCard from 'src/react/browser-compatible/components/card/CompatibleCard';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmationToken: urlGetParameter('confirmation_token')
    };
    setupLoading(this);
  }
  componentWillMount() {
    const { confirmationToken } = this.state;

    if (!confirmationToken) {
      return this.clearLoading('confirm', '!Missing confirmation token');
    }
    this.setLoading('confirm', 'Confirming...');
    request('users.confirm', confirmationToken).then(res => {
      if (res.ok) {
        this.clearLoading('confirm', 'Successfully confirmed the email');
      } else {
        this.clearLoading('confirm', '!Something went wrong.');
      }
    });
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  render() {
    const lState = this.getLoading('confirm');
    const subtitle = lState.loading || lState.success || lState.error;

    return (
      <CompatibleCard>
        <div style={{ marginTop: '36px' }}>
          <CardHeader title="confirming your email" subtitle={subtitle} />
        </div>
      </CompatibleCard>
    );
  }
}
