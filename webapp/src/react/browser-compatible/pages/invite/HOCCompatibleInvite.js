import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { string } from 'valjs';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import CompatibleInvite from './CompatibleInvite';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

class HOCCompatibleInvite extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { 
      invites: fromJS([
        { firstName: '', email: '' },
        { firstName: '', email: '' },
        { firstName: '', email: '' },
      ]) 
    };
    setupLoading(this);
  }
  componentDidMount() {
  }
  onNameChange(i, e) {
    let { invites } = this.state;
    invites = invites.setIn([i, 'firstName'], e.target.value);
    this.setState({ invites });
  }
  onEmailChange(i, e) {
    let { invites } = this.state;
    invites = invites.setIn([i, 'email'], e.target.value);
    this.setState({ invites });
  }
  onAddInput() {
    let { invites } = this.state;
    invites = invites.push(fromJS({ firstName: '', email: '' }));
    this.setState({ invites });
  }
  onSendInvites() {
    const { invites } = this.state;
    const { sendInvite } = this.props;

    invites.forEach((inv, i) => {
      if(this.isLoading(i) || this.getLoading(i).successLabel) return;
      if(inv.get('email').length && string.format('email').test(inv)) {
        return this.clearLoading(i, '!Invalid email');
      }
      console.log('sending', i);
      this.setLoading(i);
      sendInvite(inv.get('firstName'), inv.get('email')).then((res) => {
        console.log('clear', i, res);
        if(res.ok) {
          this.clearLoading(i, 'Invited');
        } else {
          this.clearLoading(i, '!Error', 5000);
        }
      });
    })
  }
  render() {
    const { invites } = this.state;
    return (
      <CompatibleCard>
        <CompatibleInvite 
          delegate={this} 
          invites={invites}
          {...this.bindLoading()}
        />
      </CompatibleCard>
    );
  }
}
// const { string } = PropTypes;

HOCCompatibleInvite.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  sendInvite: ca.users.invite,
})(HOCCompatibleInvite);
