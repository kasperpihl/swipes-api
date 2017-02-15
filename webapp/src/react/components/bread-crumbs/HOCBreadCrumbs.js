import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { list } from 'react-immutable-proptypes';
import Icon from 'Icon';
import * as a from 'actions';
import { setupCachedCallback } from 'classes/utils';

import './styles/bread-crumbs.scss';

class HOCNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClickCached = setupCachedCallback(this.onClick, this);
  }
  onClick(i) {
    const { target, pop } = this.props;
    pop(target, i);
  }
  renderCrumb(crumb, i) {
    const title = crumb.get('title');

    return (
      <div className="bread-crumbs__crumb" key={i} ref="container" onClick={this.onClickCached(i)}>
        <div className="bread-crumbs__title">
          {title}
        </div>
        <div className="bread-crumbs__seperator">
          <Icon svg="ArrowRightLine" className="bread-crumbs__icon" />
        </div>
      </div>
    );
  }
  renderBreadCrumbs() {
    const { history } = this.props;

    if (!history) {
      return undefined;
    }

    const breadCrumbsHTML = [];

    history.forEach((crumb, i) => {
      if ((i + 1) < history.size) {
        breadCrumbsHTML.push(this.renderCrumb(crumb, i));
      }
    });

    return <div className="bread-crumbs">{breadCrumbsHTML}</div>;
  }
  render() {
    return this.renderBreadCrumbs();
  }
}

const { func, string } = PropTypes;

HOCNavBar.propTypes = {
  target: string.isRequired,
  history: list,
  pop: func,
};

function mapStateToProps(state, ownProps) {
  return {
    history: state.getIn(['navigation', ownProps.target]),
  };
}


export default connect(mapStateToProps, {
  pop: a.navigation.pop,
})(HOCNavBar);
