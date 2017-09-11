import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import InfoTab from './InfoTab';

class HOCInfoTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  render() {
    const { infoTab } = this.props;

    return <InfoTab infoTab={infoTab} delegate={infoTab.get('delegate')} />;
  }
}
// const { string } = PropTypes;

HOCInfoTab.propTypes = {};

const mapStateToProps = (state) => ({
  infoTab: state.get('infoTab'),
});

export default connect(mapStateToProps, {
})(HOCInfoTab);
