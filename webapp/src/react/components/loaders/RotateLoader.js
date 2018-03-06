import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';

// import Icon from 'Icon';
import './styles/rotate-loader.scss';

class RotateLoader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  render() {
    const { size, color, bgColor } = this.props;
    
    let sizeStyles = {
      width: size + 'px',
      height: size  + 'px',
    }

    return (
      <div className="rotate-loader" style={sizeStyles}>
        <svg viewBox="0 0 36 36">
          <path d="M18,18V0C8.1,0,0,8.1,0,18H18z" stroke="transparent" />
        </svg>
      </div>
    );
  }
}

export default RotateLoader

// const { string } = PropTypes;

RotateLoader.propTypes = {};
