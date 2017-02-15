import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning';
import { navigation } from 'actions';

import './styles/sidebar.scss';

class HOCSidebar extends Component {
  constructor(props) {
    super(props);
    this.clickedItem = this.clickedItem.bind(this);
    this.rightClickedItem = this.rightClickedItem.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  clickedItem(e) {
    const { navSet } = this.props;
    const id = e.target.getAttribute('data-id');
    navSet('primary', id);
  }
  rightClickedItem(e) {
    const { navSet, secondaryNavId } = this.props;
    let id = e.target.getAttribute('data-id');
    if (id === secondaryNavId) {
      id = null;
    }
    return navSet('secondary', id);
  }
  renderItem(item) {
    const { navId, counters, secondaryNavId } = this.props;
    const counter = counters.get(item.id);

    let className = 'sidebar__item';

    if (item.id === navId) {
      className += ' sidebar__item--active';
    }
    if (item.id === secondaryNavId) {
      className += ' sidebar__item--secondary-active';
    }
    let notif = null;
    if (counter && counter.length) {
      notif = <div className="sidebar__notification" key={counter}>{counter}</div>;
    }

    let image = <Icon svg={item.svg} className="sidebar__icon" />;

    if (item.id === 'profile') {
      image = <HOCAssigning assignees={[item.personId]} />;
    }

    return (
      <div
        onClick={this.clickedItem}
        onContextMenu={this.rightClickedItem}
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
      { id: 'milestones', svg: 'Flag' },
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
    navId: state.getIn(['navigation', 'primary', 'id']),
    secondaryNavId: state.getIn(['navigation', 'secondary', 'id']),
    counters: state.getIn(['navigation', 'counters']),
  };
}


const { string, func } = PropTypes;
HOCSidebar.propTypes = {
  me: map,
  navId: string,
  secondaryNavId: string,
  counters: map,
  navSet: func,
};

const ConnectedHOCSidebar = connect(mapStateToProps, {
  navSet: navigation.set,
})(HOCSidebar);
export default ConnectedHOCSidebar;
