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
    setupLoading(this);
  }
  componentDidMount() {
  }
  onSubmit(token) {
    const { createStripeCustomer } = this.props;
    this.setLoading('submit');
    createStripeCustomer(token.id).then((res) => {
      if (res.ok) {
        this.clearLoading('submit');
      } else {
        this.clearLoading('submit', '!Something went wrong');
      }
    })
  }
  render() {
    let token = 'pk_live_vLIRvcBoJ4AA9sFUpmVT11gQ';
    if (process.env.NODE_ENV !== 'production') {
      token = 'pk_test_0pUn7s5EyQy7GeAg93QrsJl9';
    }
    return (
      <StripeProvider apiKey={token}>
        <Elements>
          <Billing
            delegate={this}
            {...this.bindLoading() }
          />
        </Elements>
      </StripeProvider>
    );
  }
}
// const { string } = PropTypes;

HOCBilling.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  createStripeCustomer: ca.organizations.createStripeCustomer,
})(HOCBilling);
