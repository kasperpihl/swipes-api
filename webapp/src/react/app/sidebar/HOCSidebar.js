import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning';
import * as a from 'actions';
import { setupCachedCallback } from 'classes/utils';

import './styles/sidebar.scss';

class HOCSidebar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      navItems: [
        { id: 'GoalList', svg: 'Goals' },
        // { id: 'MilestoneList', svg: 'Milestones' },
        { id: 'Dashboard', svg: 'Notification' },
        { id: 'Find', svg: 'Find' },
        { id: 'Slack', svg: 'Hashtag' },
        { id: 'Store', svg: 'Store' },
      ],
      activeItem: 0,
    };
    this.onClickCached = setupCachedCallback(this.onClick, this);
    this.onRightClickCached = setupCachedCallback(this.onClick, this);
  }
  componentWillReceiveProps(nextProps) {
    const { navItems } = this.state;

    if (nextProps.navId !== this.props.navId) {
      const isNavitem = navItems.some(item => item.id === nextProps.navId);

      if (isNavitem) {
        navItems.forEach((item, i) => {
          if (item.id === nextProps.navId) {
            this.setState({ activeItem: i });
          }
        });
      } else {
        this.setState({ activeItem: null });
      }
    }
  }
  onClick(id, target) {
    const { navSet } = this.props;
    if (target === 'secondary' && id === 'slack') {
      return;
    }
    navSet(target, {
      id,
      title: this.getTitleForId(id),
    });
  }
  getTitleForId(id) {
    switch (id) {
      case 'MilestoneList':
        return 'Milestones (In Progress)';
      case 'GoalList':
        return 'Goals';
      default:
        return id;
    }
  }
  renderItem(item) {
    const { navId, counters } = this.props;
    const counter = counters.get(item.id);

    let className = 'sidebar__item';

    if (item.id === navId) {
      className += ' sidebar__item--active';
    }

    let notif = null;
    if (counter && counter.length) {
      notif = <div className="sidebar__notification" key={counter}>{counter}</div>;
    }

    let image = <Icon svg={item.svg} className="sidebar__icon" />;

    if (item.id === 'Profile') {
      image = <HOCAssigning assignees={[item.personId]} rounded size={44} />;
    }

    return (
      <div
        onClick={this.onClickCached(item.id, 'primary')}
        onContextMenu={this.onRightClickCached(item.id, 'secondary')}
        className={className}
        key={item.id}
        data-id={item.id}
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
  renderSlider() {
    const { activeItem } = this.state;
    const styles = {};
    let className = 'sidebar__slider';

    if (activeItem === null) {
      className += ' sidebar__slider--hidden';
    } else {
      styles.transform = `translateY(${activeItem * 100}%)`;
    }

    return <div className={className} style={styles} />;
  }
  renderProfile() {
    const { me } = this.props;

    if (!me) {
      return undefined;
    }

    return this.renderItem({ id: 'Profile', personId: me.get('id') });
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
            {this.renderSlider()}
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
