import React, { PureComponent } from 'react';
import {injectStripe} from 'react-stripe-elements';
import { styleElement } from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import Button from 'src/react/components/button/Button';
import { bindAll } from 'swipes-core-js/classes/utils';
import CardSection from './CardSection';
import styles from './ChangeCardDetailsModal.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const ComposerWrapper = styleElement('div', styles.ComposerWrapper);
const ActionBar = styleElement('div', styles.ActionBar);

class ChangeCardDetailsModal extends PureComponent {
  constructor(props) {
    super(props)

    bindAll(this, ['onSubmit']);
    setupDelegate(this, 'onChangeSuccess');
  }
  onSubmit(e) {
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
  }
  render() {
    const { getLoading } = this.props;

    return (
      <Wrapper>
        <ComposerWrapper>
          <CardSection label="Change card details" />
        </ComposerWrapper>
        <ActionBar>
          <Button
            title="Change"
            onClick={this.onSubmit}
            {...getLoading('changeCardNumber') } />
        </ActionBar>
      </Wrapper>
    )
  }
}

export default injectStripe(ChangeCardDetailsModal);