import React, { PureComponent } from 'react';
import { Elements, injectStripe } from 'react-stripe-elements';
import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';

import SW from './BillingChangeCard.swiss';

export default class BillingChangeCard extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  handleSubmit = e => {
    const { organizationId } = this.props;
    this.setLoading('changeCardNumber');
    this.stripe
      .createToken()
      .then(({ token, error }) => {
        if (error) {
          console.log(error);
          this.clearLoading('changeCardNumber', `!${error.message}`);
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
          this.clearLoading('changeCardNumber', 'Changed', 1500, () => {
            if (hideModal) {
              hideModal();
            }
          });
        } else {
          this.clearLoading('changeCardNumber', '!Error', 3000);
        }
      });
  };
  RenderForm = injectStripe(props => {
    this.stripe = props.stripe;
    return (
      <SW.Wrapper>
        <SW.ComposerWrapper>
          <CardSection label="Change card details" />
        </SW.ComposerWrapper>
        <SW.ActionBar>
          <Button
            title="Change"
            onClick={this.handleSubmit}
            {...this.getLoading('changeCardNumber')}
          />
        </SW.ActionBar>
      </SW.Wrapper>
    );
  });
  render() {
    return (
      <Elements>
        <RenderForm />
      </Elements>
    );
  }
}
