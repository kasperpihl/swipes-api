import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import Button from 'src/react/components/button/Button';
import SW from './ChangeBillingPlan.swiss';

class ChangeBillingPlan extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this, 'onConfirm');
  }
  render() {
    const { getLoading, content } = this.props;

    return (
      <SW.Wrapper>
        <SW.ComposerWrapper>
          {content}
        </SW.ComposerWrapper>
        <SW.ActionBar>
          <Button
            title="Confirm"
            onClick={this.onConfirm}
            {...getLoading('confirm') } />
        </SW.ActionBar>
      </SW.Wrapper>
    )
  }
}

export default ChangeBillingPlan;
