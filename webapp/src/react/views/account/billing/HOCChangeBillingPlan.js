import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import * as ca from 'swipes-core-js/actions';
import {
  setupLoading,
} from 'swipes-core-js/classes/utils';
import { fromJS } from 'immutable';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import ChangeBillingPlan from './ChangeBillingPlan';

class HOCChangeBillingPlan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };

    setupLoading(this);
  }
  onConfirm(e) {
    const { changeBillingPlan, hideModal, plan } = this.props;
    this.setLoading('confirm');

    changeBillingPlan(plan).then((res) => {
      if (res.ok) {
        this.clearLoading('confirm', 'Changed', 1500, () => {
          if (hideModal) {
            hideModal();
          }
        });
      } else {
        this.clearLoading('confirm', '!Error', 3000);
      }
    })
  }

  render() {
    const { plan, currentPlan } = this.props;
    let content = `You are about to change your billing plan from ${currentPlan} to ${plan}. Any unused time from the current subscription will be converted in credits that will be used for future payments.
    
    Click 'Confirm’ to change the plan.`;

    return (
      <ChangeBillingPlan
        content={content}
        delegate={this}
        {...this.bindLoading() }
      />
    );
  }
}

export default navWrapper(connect(state => ({
  // state to props
}), {
  changeBillingPlan: ca.organizations.changeBillingPlan,
})(HOCChangeBillingPlan));
