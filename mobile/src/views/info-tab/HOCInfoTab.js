import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

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

    return <InfoTab infoTab={infoTab} />;
  }
}

const mapStateToProps = (state) => ({
  infoTab: state.infoTab,
});

export default connect(mapStateToProps, {
})(HOCInfoTab);
