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
    this.onClickCached = setupCachedCallback(this.onClick, this);
    this.onRightClickCached = setupCachedCallback(this.onClick, this);
  }
  onClick(id, target) {
    const { navSet } = this.props;
    if (target === 'secondary' && id === 'slack') {
      return;
    }
    navSet(target, id);
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

    if (item.id === 'profile') {
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
    return [
      { id: 'goals', svg: 'Goals' },
      { id: 'milestones', svg: 'Milestones' },
      { id: 'dashboard', svg: 'Notification' },
      { id: 'find', svg: 'Find' },
      { id: 'slack', svg: 'Hashtag' },
      //{ id: 'store', svg: 'Store' },
    ].map(o => this.renderItem(o));
  }
  renderProfile() {
    const { me } = this.props;

    if (!me) {
      return undefined;
    }

    return this.renderItem({ id: 'profile', personId: me.get('id') });
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
    navId: state.getIn(['navigation', 'id']),
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
