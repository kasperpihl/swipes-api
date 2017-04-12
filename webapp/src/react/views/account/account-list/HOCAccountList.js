import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AccountList from './AccountList';

class HOCAccountList extends PureComponent {
  static minWidth() {
    return 600;
  }
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);
    this.state = {
      isLoggingOut: false,
      sections: [
        {
          id: 'Profile',
          title: 'My Profile',
          subtitle: 'Change your profile picture and correct your surname',
        },
        {
          id: 'Organization',
          title: 'Manage Team',
          subtitle: 'Invite new team members and manage current ones',
        },
        {
          id: 'Settings',
          title: 'Change Settings',
          subtitle: 'Manage integrations',
        },
        {
          id: 'Payment',
          title: 'Payment',
          subtitle: 'Manage payment',
        },
      ],
    };
  }
  componentDidMount() {
  }
  onLogout(e) {
    const { confirm, signout } = this.props;
    const options = this.getOptionsForE(e);

    confirm(Object.assign({}, options, {
      title: 'Log out',
      message: 'Do you want to log out?',
    }), (i) => {
      if (i === 1) {
        this.setState({ isLoggingOut: true });
        signout(() => {
          this.setState({ isLoggingOut: false });
        });
      }
    });
  }
  onClick(section) {
    console.log('section', section);
    const { navPush } = this.props;
    navPush({
      id: section.id,
      title: section.title,
    });
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    };
  }
  render() {
    const { sections, isLoggingOut } = this.state;

    return (
      <AccountList
        sections={sections}
        delegate={this}
        isLoggingOut={isLoggingOut}
      />
    );
  }
}
// const { string } = PropTypes;

HOCAccountList.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  signout: a.main.signout,
  confirm: a.menus.confirm,
})(HOCAccountList);
