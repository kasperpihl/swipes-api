import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StripeProvider, Elements } from 'react-stripe-elements';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import ChangeCardDetailsModal from './ChangeCardDetailsModal';

@navWrapper
@connect(null, {
  changeCardDetails: ca.organizations.changeCardDetails,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);

    setupLoading(this);
  }
  onChangeSuccess(token) {
    const { changeCardDetails, hideModal } = this.props;
    this.setLoading('confirm');

    changeCardDetails(token.id).then((res) => {
      if (res.ok) {
        this.clearLoading('changeCardNumber', 'Changed', 1500, () => {
          if (hideModal) {
            hideModal();
          }
        });
      } else {
        this.clearLoading('changeCardNumber', '!Error', 3000);
      }
    })
  }
  render() {
    // if we need to change the token this is not the only instance of it
    // we need to fix that
    let token = 'pk_live_vLIRvcBoJ4AA9sFUpmVT11gQ';

    if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'staging.swipesapp.com') {
      token = 'pk_test_0pUn7s5EyQy7GeAg93QrsJl9';
    }

    return (
      <StripeProvider apiKey={token}>
        <Elements>
          <ChangeCardDetailsModal
            delegate={this}
            {...this.bindLoading() }
          />
        </Elements>
      </StripeProvider>
    );
  }
}
