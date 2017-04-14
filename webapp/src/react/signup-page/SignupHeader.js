import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
// import './styles/SignupHeader.scss';

class SignupHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderCrumbs() {
    const { crumbs, activeCrumb: aC } = this.props;
    if (!crumbs) {
      return undefined;
    }
    return crumbs.map((c, i) => (
      <div key={i} className={`breadcrumb ${i === aC ? 'breadcrumb--active' : ''}`}>{`${i + 1}. ${c}`}</div>
    ));
  }
  render() {
    const { mobile } = this.props;
    let className = 'header';
    if (mobile) {
      className += ' header--mobile';
    }
    return (
      <div className={className}>
        <div className="breadcrumbs">
          {this.renderCrumbs()}
        </div>
        <div className="logo">
          <Icon icon="SwipesLogoEmpty" />
        </div>
      </div>
    );
  }
}

export default SignupHeader;

// const { string } = PropTypes;

SignupHeader.propTypes = {};
