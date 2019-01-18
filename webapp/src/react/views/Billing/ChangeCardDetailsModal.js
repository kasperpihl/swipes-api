import React, { PureComponent } from 'react';
import { injectStripe } from 'react-stripe-elements';
import { setupDelegate } from 'react-delegate';
import Button from 'src/react/components/Button/Button';
import CardSection from './CardSection';
import SW from './ChangeCardDetailsModal.swiss';

class ChangeCardDetailsModal extends PureComponent {
  constructor(props) {
    super(props);

    setupDelegate(this, 'onChangeSuccess');
  }
  onSubmit = e => {
    const { stripe, setLoading, clearLoading } = this.props;

    setLoading('changeCardNumber');
    stripe.createToken().then(({ token, error }) => {
      if (error) {
        console.log(error);
        clearLoading('changeCardNumber');
        this.setState({ errorMessage: error.message });
      } else {
        console.log('Received Stripe token:', token);
        this.onChangeSuccess(token);
      }
    });
  };
  render() {
    const { getLoading } = this.props;

    return (
      <SW.Wrapper>
        <SW.ComposerWrapper>
          <CardSection label="Change card details" />
        </SW.ComposerWrapper>
        <SW.ActionBar>
          <Button
            title="Change"
            onClick={this.onSubmit}
            {...getLoading('changeCardNumber')}
          />
        </SW.ActionBar>
      </SW.Wrapper>
    );
  }
}

export default injectStripe(ChangeCardDetailsModal);
