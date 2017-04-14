import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
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
    if(!crumbs){
      return undefined;
    }
    return crumbs.map((c, i) => (
      <div className={`breadcrumb ${i === aC ? 'breadcrumb--active' : ''}`}>{`${i+1}. ${c}`}</div>
    ))
  }
  render() {
    const { mobile } = this.props;
    let className = 'header';
    if(mobile){
      className += ' header--mobile';
    }
    return (
      <div className={className}>
        <div className="breadcrumbs">
          {this.renderCrumbs()}
        </div>
        <div className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
            <path d="M103.416,48.168h0A11.063,11.063,0,0,0,98.469,47h-65.3a3.11483,3.11483,0,0,1-3.165-2.839A3.0001,3.0001,0,0,1,33,41h70.75L120,15H30.642C13.865,15-.273,28.729.004,45.504a29.99619,29.99619,0,0,0,16.58,26.328l.026.013A11.43686,11.43686,0,0,0,21.726,73H87a3.11355,3.11355,0,0,1,3.165,2.84A2.99983,2.99983,0,0,1,87.169,79H16.25L0,105H89.358c16.777,0,30.914-13.729,30.638-30.504a29.99738,29.99738,0,0,0-16.58-26.328" stroke="transparent" />
          </svg>
        </div>
      </div>
    );
  }
}

export default SignupHeader;

// const { string } = PropTypes;

SignupHeader.propTypes = {};
