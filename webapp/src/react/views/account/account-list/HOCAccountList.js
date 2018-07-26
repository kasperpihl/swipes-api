import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import AccountList from './AccountList';

@navWrapper
@connect(state => ({
  me: state.me,
}), {
  signout: mainActions.signout,
  browser: mainActions.browser,
  confirm: menuActions.confirm,
})

export default class extends PureComponent {
  static sizes() {
    return [654];
  }
  constructor(props) {
    super(props);
    this.state = {
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
          subtitle: 'Get started with the Swipes Workspace',
        },
        msgGen.me.isAdmin() ? {
          id: 'Billing',
          title: 'Billing',
          subtitle: 'Set up and manage the payment card for the account',
        } : undefined,
        {
          id: 'FAQ',
          title: 'Help Center',
          subtitle: 'See answers to frequently asked questions and learn all about using the Swipes Workspace. Or reach out to help@swipesapp.com for any help.',
        }
      ].filter(v => !!v),
    };
    setupLoading(this);
  }
  onLogout(e) {
    const { confirm, signout } = this.props;
    const options = this.getOptionsForE(e);

    confirm(Object.assign({}, options, {
      title: 'Log out',
      message: 'Do you want to log out?',
    }), (i) => {
      if (i === 1) {
        this.setLoading('logout');
        signout(() => {
          this.clearLoading('logout');
        });
      }
    });
  }
  onClick(i, e) {
    const { sections } = this.state;
    const section = sections[i];

    const { navPush, browser, target } = this.props;
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
        {...this.bindLoading()}
      />
    );
  }
}
