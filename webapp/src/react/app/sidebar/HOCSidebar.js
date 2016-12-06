import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { navigation } from '../../../actions';


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
  renderItem(id, title) {
    const { navId } = this.props;
    let className = 'sidebar-item';
    if (id === navId) {
      className += ' active';
    }
    return (
      <div
        onClick={this.clickedItem}
        className={className}
        key={id}
        data-id={id}
      >
        {title}
      </div>
    );
  }
  renderTeams() {
    const { me } = this.props;
    if (!me) {
      return undefined;
    }

    return me.get('organizations').map(o => this.renderItem(o.get('id'), o.get('name')));
  }
  renderProfile() {
    const { me } = this.props;
    if (!me) {
      return undefined;
    }
    return this.renderItem(me.get('id'), me.get('name'));
  }
  renderStore() {
    // For later
  }
  render() {
    return (
      <div className="sw-sidebar">
        {this.renderTeams()}
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
