import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import Icon from 'Icon';
import { navigation } from 'actions';

import './styles/sidebar.scss';

class HOCSidebar extends Component {
  constructor(props) {
    super(props);
    this.clickedItem = this.clickedItem.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  clickedItem(e) {
    const { navigateToId } = this.props;
    const id = e.target.getAttribute('data-id');

    navigateToId(id);
  }
  renderItem(item) {
    const { navId } = this.props;
    let className = 'sidebar__item';

    if (item.id === navId) {
      className += ' sidebar__item--active';
    }
    let image = <Icon svg={item.svg} className="sidebar__icon" />;
    if (item.src) {
      image = <img src={item.src} className="sidebar__image" alt="" />;
    }

    return (
      <div
        onClick={this.clickedItem}
        className={className}
        key={item.id}
        data-id={item.id}
      >
        {image}
      </div>
    );
  }
  renderTopSection() {
    return [
      { id: 'goals', svg: 'Goals' },
      { id: 'dashboard', svg: 'Collection' },
      { id: 'find', svg: 'Find' },
    ].map(o => this.renderItem(o));
  }
  renderProfile() {
    const { me } = this.props;

    if (!me) {
      return undefined;
    }

    return this.renderItem({ id: 'profile', src: me.get('profile_pic') });
  }
  renderStore() {
    // For later
  }
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar__top-section2">
          {this.renderTopSection()}
        </div>
        {this.renderProfile()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    me: state.get('me'),
    navId: state.getIn(['navigation', 'id']),
  };
}


const { string, func } = PropTypes;
HOCSidebar.propTypes = {
  me: map,
  navId: string,
  navigateToId: func,
};

const ConnectedHOCSidebar = connect(mapStateToProps, {
  navigateToId: navigation.navigateToId,
})(HOCSidebar);
export default ConnectedHOCSidebar;
