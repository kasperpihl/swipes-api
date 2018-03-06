import React, { PureComponent } from 'react'
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';

// import Icon from 'Icon';
// import './styles/NotFound.scss';

class NotFound extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="not-found">
        This is not the component you were looking for.
      </div>
    )
  }
}

export default NotFound

// const { string } = PropTypes;

NotFound.propTypes = {};
