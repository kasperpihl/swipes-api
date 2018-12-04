import React, { PureComponent } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import ProjectContext from './ProjectContext';

export default WrappedComponent => {
  class WithProjectTask extends PureComponent {
    static contextType = ProjectContext;
    componentDidMount() {
      const { taskId } = this.props;
      const stateManager = this.context;
      this.unsubscribe = stateManager.subscribeTask(taskId, this.forceUpdate);
    }
    componentWillUnmount() {
      this.unsubscribe();
    }
    render() {
      const stateManager = this.context;
      const { taskId } = this.props;
      const clientState = stateManager.getClientState();
      const localState = stateManager.getLocalState();

      const selectedId = localState.get('selectedId');
      const selectionStart = localState.get('selectionStart');

      return (
        <WrappedComponent
          {...this.props}
          title={clientState.getIn(['tasksById', taskId, 'title'])}
          isSelected={taskId === selectedId}
          selectionStart={taskId === selectedId && selectionStart}
          indention={clientState.getIn(['indention', taskId])}
          completion={clientState.getIn(['completion', taskId])}
          hasChildren={localState.getIn(['hasChildren', taskId])}
          expanded={localState.getIn(['expanded', taskId])}
          stateManager={stateManager}
        />
      );
    }
  }
  hoistNonReactStatics(WithProjectTask, WrappedComponent);
  return WithProjectTask;
};
