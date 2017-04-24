import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
    return 700;
  }
  constructor(props) {
    super(props);
    this.state = {
      isLoggingOut: false,
      sections: [
        {
          id: 'Profile',
          title: 'My profile',
          subtitle: 'Customize your profile with a photo, share your role in the team and edit your information',
        },
        {
          id: 'Organization',
          title: 'Team account',
          subtitle: 'Invite new team members and manage user permissions',
        },
        {
          id: 'Onboarding',
          title: 'Onboarding',
          subtitle: 'Learn how to use get started with Swipes',
        },
        msgGen.me.isAdmin() ? {
          id: 'Payment',
          title: 'Billing (coming soon)',
          subtitle: 'Set up and manage the payment card for the account',
        } : undefined,
        {
          id: 'FAQ',
          title: 'Help Center',
          subtitle: 'See answers to frequently asked questions and learn all about using the Swipes Workspace. Or reach out to help@swipesapp.com for any help.',
        }
      ].filter(v => !!v),
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
    const { navPush, browser, target } = this.props;
    if (section.id === 'Payment') {
      return undefined;
    }
    if (section.id === 'FAQ') {
      return browser(target, 'http://support.swipesapp.com/hc/en-us/categories/115000489025-Swipes-Workspace');
    }
    return navPush({
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

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  signout: a.main.signout,
  browser: a.main.browser,
  confirm: a.menus.confirm,
})(HOCAccountList);
