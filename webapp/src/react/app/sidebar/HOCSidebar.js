import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning';
import * as a from 'actions';
import { setupCachedCallback } from 'swipes-core-js/classes/utils';

import './styles/sidebar.scss';

class HOCSidebar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      navItems: [
        { id: 'GoalList', svg: 'Goals' },
        { id: 'Notifications', svg: 'Notification' },
        // { id: 'Onboarding', svg: 'Onboarding' },
        // { id: 'MilestoneList', svg: 'Milestones' },

        // { id: 'Find', svg: 'Find' },
        // { id: 'Slack', svg: 'Hashtag' },
        // { id: 'Store', svg: 'Store' },
      ].filter(v => !!v),
    };
    this.state.activeItem = this.getActiveItem(props.navId);
    this.onClickCached = setupCachedCallback(this.onClick, this);
    this.onRightClickCached = setupCachedCallback(this.onClick, this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navId !== this.props.navId) {
      this.setState({ activeItem: this.getActiveItem(nextProps.navId) });
    }
  }
  onClick(id, target) {
    const { navSet } = this.props;
    if (target === 'secondary' && id === 'Slack') {
      return;
    }
    navSet(target, {
      id,
      title: this.getTitleForId(id),
    });
  }
  getActiveItem(navId) {
    const { navItems } = this.state;
    const isNavitem = navItems.some(item => item.id === navId);
    let activeItem = null;
    if (isNavitem) {
      navItems.forEach((item, i) => {
        if (item.id === navId) {
          activeItem = i;
        }
      });
    }
    return activeItem;
  }
  getTitleForId(id) {
    switch (id) {
      case 'MilestoneList':
        return 'Milestones';
      case 'GoalList':
        return 'Goals';
      case 'AccountList':
        return 'Account';
      default:
        return id;
    }
  }
  getRemainingOnboarding() {
    const { me } = this.props;
    const order = me.getIn(['settings', 'onboarding', 'order']);
    const completed = me.getIn(['settings', 'onboarding', 'completed']);
    return order.filter(id => !completed.get(id)).size;
  }
  renderItem(item) {
    const { navId, counters } = this.props;
    let counter = counters.get(item.id);
    if (item.id === 'Onboarding') {
      counter = this.getRemainingOnboarding();
    }
    let className = 'sidebar__item';

    if (item.id === navId) {
      className += ' sidebar__item--active';
    }

    let notif = null;
    if (counter) {
      notif = <div className="sidebar__notification">{counter}</div>;
    }

    let image = <Icon icon={item.svg} className="sidebar__icon" />;

    if (item.id === 'AccountList') {
      image = <HOCAssigning assignees={[item.personId]} rounded size={44} />;
    }

    return (
      <div
        onClick={this.onClickCached(item.id, 'primary')}
        onContextMenu={this.onRightClickCached(item.id, 'secondary')}
        className={className}
        key={item.id}
        data-id={item.id}
        data-title={this.getTitleForId(item.id)}
      >
        {image}
        {notif}
      </div>
    );
  }
  // render
  renderTopSection() {
    const { navItems } = this.state;

    if (navItems) {
      return navItems.map((o, i) => this.renderItem(o, i));
    }

    return undefined;
  }
  renderProfile() {
    const { me } = this.props;

    if (!me) {
      return undefined;
    }

    return this.renderItem({ id: 'AccountList', personId: me.get('id') });
  }
  renderStore() {
    // For later
  }
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar__top-section">
          <div className="sidebar__section">
            {this.renderTopSection()}
          </div>
        </div>
        <div className="sidebar__bottom-section">
          {this.renderProfile()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    me: state.get('me'),
    navId: state.getIn(['navigation', 'primary', 'id']),
    counters: state.getIn(['navigation', 'counters']),
  };
}


const { string, func } = PropTypes;
HOCSidebar.propTypes = {
  me: map,
  navId: string,
  counters: map,
  navSet: func,
};

const ConnectedHOCSidebar = connect(mapStateToProps, {
  navSet: a.navigation.set,
})(HOCSidebar);
export default ConnectedHOCSidebar;
