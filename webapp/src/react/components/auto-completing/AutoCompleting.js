import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import './styles/auto-completing.scss';

class AutoCompleting extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    const { boundingRect } = this.props;
    let className = 'auto-completing';
    const style = {};
    if(boundingRect) {
      className += ' auto-completing__shown';
      style.width = 400 + 'px';
      style.height = 400 + 'px';
      style.bottom = boundingRect.top + 'px';
      style.left = 0 + 'px';
    }

    return (
      <div className="auto-completing" style={style}>
      </div>
    )
  }
}

export default AutoCompleting

// const { string } = PropTypes;

AutoCompleting.propTypes = {};
