import React, { PureComponent } from 'react';
import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './ChangeBillingPlan.swiss';

@navWrapper
export default class ChangeBillingPlan extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  handleConfirm = e => {
    const { hideModal, plan, organizationId } = this.props;
    this.setLoading('confirm');

    request('billing.updatePlan', { plan, organizationId }).then(res => {
      if (res.ok) {
        this.clearLoading('confirm', 'Changed', 1500, () => {
          if (hideModal) {
            hideModal();
          }
        });
      } else {
        this.clearLoading('confirm', '!Error', 3000);
      }
    });
  };

  render() {
    const { plan, currentPlan } = this.props;
    let content = `You are about to change your billing plan from ${currentPlan} to ${plan}. Any unused time from the current subscription will be converted in credits that will be used for future payments.
    
    Click 'Confirm’ to change the plan.`;

    return (
      <SW.Wrapper>
        <SW.ComposerWrapper>{content}</SW.ComposerWrapper>
        <SW.ActionBar>
          <Button
            title="Confirm"
            onClick={this.onConfirm}
            {...this.getLoading('confirm')}
          />
        </SW.ActionBar>
      </SW.Wrapper>
    );
  }
}
