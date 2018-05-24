import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import * as ca from 'swipes-core-js/actions';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Onboarding from './Onboarding';

@navWrapper
@connect(state => ({
  me: state.get('me'),
  hasOrg: state.getIn(['me', 'has_organization']),
  onboarding: state.get('onboarding'),
  userOnboarding: state.getIn(['me', 'settings', 'onboarding']),
}), {
  complete: ca.onboarding.complete,
  browser: mainActions.browser,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onClick(i, item, e) {
    const { browser, target, complete, openSecondary } = this.props;

    if(item.get('id') === 'personalize-swipes') {
      openSecondary({
        id: 'Profile',
        title: 'Profile',
      });
    } else if (['add-goal-milestone', 'create-milestone'].indexOf(item.get('id')) > -1) {
      openSecondary({
        id: 'PlanList',
        title: 'Plan',
      });
    } else if(item.get('id') === 'create-goal') {
      openSecondary({
        id: 'TakeAction',
        title: 'Goals',
      });
    } else if(item.get('id') === 'open-swipes-intro') {
      openSecondary({
        id: 'SwipesIntro',
        title: 'Swipes Intro',
      });
      setTimeout(() => {
        complete(item.get('id'));
      }, 2000);
    } else if(item.get('id') === 'invite-team') {
      openSecondary({
        id: 'Organization',
        title: 'Team account',
      });
      setTimeout(() => {
        complete(item.get('id'));
      }, 2000);
    }
    else if(item.get('url')) {
      setTimeout(() => {
        complete(item.get('id'));
      }, 5000);

      browser(target, item.get('url'));
    }

  }
  onClickTutorial() {
    const { browser, target,} = this.props;

    browser(target, 'https://youtu.be/tyRJeiZOnfI');
  }
  onClickBlog() {
    const { browser, target,} = this.props;

    browser(target, 'https://swipesapp.com/blog');
  }
  render() {
    const { onboarding, userOnboarding, hasOrg, me } = this.props;
    console.log(onboarding.toJS(), userOnboarding.toJS(), me.toJS())
    if(!hasOrg) {
      return null;
    }
    const items = userOnboarding.get('order').map(
      (id) => onboarding.get(id).set('completed', !!userOnboarding.getIn(['completed',id]))
    );
    return (
      <Onboarding
        items={items}
        delegate={this}
      />
    );
  }
}
