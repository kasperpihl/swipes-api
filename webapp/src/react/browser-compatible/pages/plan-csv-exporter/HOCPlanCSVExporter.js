import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PlanCSVExporter from './PlanCSVExporter';

class HOCPlanCSVExporter extends PureComponent {
  render() {
    return (
      <PlanCSVExporter 
        token={this.props.token}
      />
    );
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
})(HOCPlanCSVExporter);