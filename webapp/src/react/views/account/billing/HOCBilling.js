import React, { PureComponent } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Billing from './Billing';

class HOCBilling extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      billingStatus: props.organization.get('plan') || 'monthly',
    };

    setupLoading(this);
  }
  componentDidMount() {
  }
  onSubmit(token) {
    const { createStripeCustomer } = this.props;
    const { billingStatus } = this.state;

    createStripeCustomer(token.id, billingStatus).then((res) => {
      if (res.ok) {
        this.clearLoading('submit');
      } else {
        this.clearLoading('submit', '!Something went wrong', 3000);
      }
    })
  }
  onSwitchPlan(plan) {
    const { organization } = this.props;
    if(!organization.get('stripe_customer_id')) {
      this.setState({ billingStatus: plan });
    }

  }
  render() {
    const { billingStatus } = this.state;
    const { organization, users } = this.props;

    let token = 'pk_live_vLIRvcBoJ4AA9sFUpmVT11gQ';
    if (process.env.NODE_ENV !== 'production') {
      token = 'pk_test_0pUn7s5EyQy7GeAg93QrsJl9';
    }
    return (
      <StripeProvider apiKey={token}>
        <Elements>
          <Billing
            delegate={this}
            billingStatus={billingStatus}
            organization={organization}
            users={users}
            {...this.bindLoading() }
          />
        </Elements>
      </StripeProvider>
    );
  }
}
// const { string } = PropTypes;

HOCBilling.propTypes = {};

function mapStateToProps(state) {
  return {
    organization: state.getIn(['me', 'organizations', 0]),
    users: state.get('users'),
  };
}

export default connect(mapStateToProps, {
  createStripeCustomer: ca.organizations.createStripeCustomer,
})(HOCBilling);
