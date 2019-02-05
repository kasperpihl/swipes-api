import React, { PureComponent } from 'react';
import SW from './ProjectSidebar.swiss';

export default class ProjectSidebar extends PureComponent {
  render() {
    return (
      <SW.Wrapper>
        <SW.TasksTracker>
          <SW.CompletedTasks>29</SW.CompletedTasks>
          <SW.TotalTasks>/35</SW.TotalTasks>
        </SW.TasksTracker>
      </SW.Wrapper>
    );
  }
}
