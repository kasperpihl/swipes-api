import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setupLoading, getURLParameter } from 'swipes-core-js/classes/utils';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

class HOCCompatibleConfirm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { 
      confirmationToken: getURLParameter('confirmation_token'),
    };
    setupLoading(this);
  }
  componentWillMount() {
    const { confirmationToken } = this.state;
    const { confirmEmail } = this.props;

    if(!confirmationToken) {
      return this.clearLoading('confirm', '!Missing confirmation token');
    }
    this.setLoading('confirm', 'Confirming...');
    confirmEmail(confirmationToken).then((res) => {
      if(res.ok) {
        this.clearLoading('confirm', 'Successfully confirmed the email');
      } else {
        this.clearLoading('confirm', '!Something went wrong.');
      }
    })
  }
  componentWillUnmount(){
    this._unmounted = true;
  }
  renderResult() {
    
    
  }
  render() {
    const lState = this.getLoading('confirm');
    const subtitle = lState.loading || lState.success || lState.error;

    return (
      <CompatibleCard>
        <CompatibleHeader title="confirming your email" subtitle={subtitle}/>
      </CompatibleCard>
    );
  }
}
// const { string } = PropTypes;

HOCCompatibleConfirm.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  confirmEmail: ca.users.confirmEmail,
})(HOCCompatibleConfirm);
