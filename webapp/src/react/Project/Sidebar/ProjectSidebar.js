import React, { PureComponent } from 'react';
import StepSlider from 'src/react/_components/StepSlider/StepSlider';
import SW from './ProjectSidebar.swiss';

export default class ProjectSidebar extends PureComponent {
  render() {
    const { tasks, completionPercentage } = this.props;
    const completedTasksAmount = Math.round(
      (completionPercentage / 100) * tasks.size
    );
  }
}
