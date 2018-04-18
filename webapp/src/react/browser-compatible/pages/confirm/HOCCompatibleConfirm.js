import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupLoading, getURLParameter } from 'swipes-core-js/classes/utils';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import * as ca from 'swipes-core-js/actions';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

class HOCCompatibleConfirm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { 
      confirmationToken: getURLParameter('confirmation_token'),
    };
    setupLoading(this);
  }
  componentWillMount() {
    const { confirmationToken } = this.state;
    const { confirmEmail } = this.props;

    if(!confirmationToken) {
      return this.clearLoading('confirm', '!Missing confirmation token');
    }
    this.setLoading('confirm', 'Confirming...');
    confirmEmail(confirmationToken).then((res) => {
      if(res.ok) {
        this.clearLoading('confirm', 'Successfully confirmed the email');
      } else {
        this.clearLoading('confirm', '!Something went wrong.');
      }
    })
  }
  componentWillUnmount(){
    this._unmounted = true;
  }
  render() {
    const lState = this.getLoading('confirm');
    const subtitle = lState.loading || lState.success || lState.error;

    return (
      <CompatibleCard>
        <div style={{ marginTop: '36px' }}>
          <CompatibleHeader title="confirming your email" subtitle={subtitle} />
        </div>
      </CompatibleCard>
    );
  }
}

export default connect(null, {
  confirmEmail: ca.users.confirmEmail,
})(HOCCompatibleConfirm);
