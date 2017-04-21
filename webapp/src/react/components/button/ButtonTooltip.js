import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import './styles/button-tooltip.scss';

class ButtonTooltip extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="button-tooltip">
        Lorem ipsum dolor sit amet.
      </div>
    );
  }
}

export default ButtonTooltip;

// const { string } = PropTypes;

ButtonTooltip.propTypes = {};
