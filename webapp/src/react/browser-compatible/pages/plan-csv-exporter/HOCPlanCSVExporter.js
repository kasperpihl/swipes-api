import React, { PureComponent } from 'react';
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

export default HOCPlanCSVExporter;