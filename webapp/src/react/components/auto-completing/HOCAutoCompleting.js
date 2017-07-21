import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AutoCompleting from './AutoCompleting';

class HOCAutoCompleting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { autoComplete } = this.props;
    let boundingRect;
    if(autoComplete && autoComplete.get('boundingRect')){
      boundingRect = autoComplete.get('boundingRect');
    }

    return (
      <AutoCompleting
        boundingRect={boundingRect}
        delegate={this}
      />
    );
  }
}
// const { string } = PropTypes;

HOCAutoCompleting.propTypes = {};

function mapStateToProps(state) {
  const mapping = {
    autoComplete: state.getIn(['main', 'autoComplete']),
  };
  return mapping;
}

export default connect(mapStateToProps, {
})(HOCAutoCompleting);
