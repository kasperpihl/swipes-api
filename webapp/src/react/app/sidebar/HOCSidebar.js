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
  renderTeam(id) {
    const { navId } = this.props;
    let className = 'sidebar__team';

    if (id === navId) {
      className += ' sidebar__team--active';
    }

    return (
      <div
        onClick={this.clickedItem}
        className={className}
        key={id}
        data-id={id}
      >
        <Icon svg="SwipesLogo" className="sidebar__icon" />
      </div>
    );
  }
  renderItem(id, image) {
    const { navId } = this.props;
    let className = 'sidebar__item';

    if (id === navId) {
      className += ' sidebar__item--active';
    }

    return (
      <div
        onClick={this.clickedItem}
        className={className}
        key={id}
        data-id={id}
      >
        <img src={image} className="sidebar__image" alt="" />
      </div>
    );
  }
  renderTeams() {
    const { me } = this.props;

    if (!me) {
      return undefined;
    }

    return me.get('organizations').map(o => this.renderTeam(o.get('id')));
  }
  renderProfile() {
    const { me } = this.props;

    if (!me) {
      return undefined;
    }

    return this.renderItem(me.get('id'), me.get('profile_pic'));
  }
  renderStore() {
    // For later
  }
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar__teams">
          {this.renderTeams()}
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
