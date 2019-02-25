import React, { PureComponent } from 'react';
import { Elements, injectStripe } from 'react-stripe-elements';
import withLoader from 'src/react/_hocs/withLoader';
import request from 'swipes-core-js/utils/request';
import BillingPaymentInput from 'src/react/Billing/Payment/Input/BillingPaymentInput';
import Button from 'src/react/_components/Button/Button';

import SW from './BillingPaymentModal.swiss';

@withLoader
export default class BillingPaymentModal extends PureComponent {
  handleSubmit = e => {
    const { organizationId, hideModal, loader } = this.props;
    loader.set('changeCardNumber');
    this.stripe
      .createToken()
      .then(({ token, error }) => {
        if (error) {
          console.log(error);
          loader.error('changeCardNumber', error.message);
          return;
        }
        console.log('Received Stripe token:', token);
        return request('billing.update', {
          stripe_token: token.id,
          organization_id: organizationId
        });
      })
      .then(res => {
        if (res.ok) {
          loader.success('changeCardNumber', 'Changed', 1500, () => {
            if (hideModal) {
              hideModal();
            }
          });
        } else {
          loader.error('changeCardNumber', res.error, 3000);
        }
      });
  };
  RenderForm = injectStripe(props => {
    const { loader } = this.props;
    this.stripe = props.stripe;
    return (
      <SW.Wrapper>
        <SW.ComposerWrapper>
          <BillingPaymentInput label="Change card details" />
        </SW.ComposerWrapper>
        <SW.ActionBar>
          <Button
            title="Change"
            onClick={this.handleSubmit}
            status={loader.get('changeCardNumber')}
          />
        </SW.ActionBar>
      </SW.Wrapper>
    );
  });
  render() {
    return (
      <Elements>
        <this.RenderForm />
      </Elements>
    );
  }
}
