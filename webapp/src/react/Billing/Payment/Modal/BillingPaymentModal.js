import React, { PureComponent } from 'react';
import { Elements, injectStripe } from 'react-stripe-elements';
import withLoader from 'src/react/_hocs/withLoader';
import request from 'core/utils/request';
import BillingPaymentInput from 'src/react/Billing/Payment/Input/BillingPaymentInput';
import Button from 'src/react/_components/Button/Button';

import SW from './BillingPaymentModal.swiss';
import Spacing from '_shared/Spacing/Spacing';

const style = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

@withLoader
export default class BillingPaymentModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cardState: ''
    };
  }

  handleChange = cs => {
    this.setState({ cardState: cs });
  };

  handleSubmit = e => {
    const { teamId, hideModal, loader } = this.props;
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
          team_id: teamId
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
        <SW.ActionBar top>
          <SW.Title>Change card details</SW.Title>
        </SW.ActionBar>
        <Spacing height={9} />
        <SW.ComposerWrapper>
          <SW.ElementWrapper>
            <SW.StripeElement
              hidePostalCode
              style={style}
              onChange={this.handleChange}
            />
          </SW.ElementWrapper>
        </SW.ComposerWrapper>
        <Spacing height={9} />
        <SW.ActionBar>
          <Button
            title="Change"
            onClick={this.handleSubmit}
            status={loader.get('changeCardNumber')}
            border
            green
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
