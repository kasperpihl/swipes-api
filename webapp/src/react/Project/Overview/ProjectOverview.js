import React, { PureComponent } from 'react';
import SW from './ProjectOverview.swiss';
import withRequests from 'swipes-core-js/components/withRequests';
import ProjectProvider from 'swipes-core-js/components/project/ProjectProvider';
import ProjectStateManager from 'swipes-core-js/classes/ProjectStateManager';
import ProjectTask from 'src/react/Project/Task/ProjectTask';
import SWView from 'src/react/_Layout/view-controller/SWView';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import Button from 'src/react/_components/Button/Button';
import withNav from 'src/react/_hocs/Nav/withNav';

@withNav
@withRequests(
  {
    project: {
      request: {
        url: 'project.get',
        body: props => ({
          project_id: props.projectId
        }),
        resPath: 'result'
      },
      cache: {
        path: props => ['project', props.projectId]
      }
    }
  },
  { renderLoader: () => <div>loading</div> }
)
export default class ProjectOverview extends PureComponent {
  static sizes = [750];
  constructor(props) {
    super(props);
    this.stateManager = new ProjectStateManager(props.project);

    this.state = {
      sliderValue: 0,
      ...this.getStateFromManager(this.stateManager)
    };
  }

  componentDidMount() {
    this.unsubscribe = this.stateManager.subscribe(stateManager => {
      const newState = this.getStateFromManager(stateManager);
      // Ensure no dangling slider.
      newState.sliderValue = Math.min(
        this.state.sliderValue,
        newState.maxIndention
      );
      for (let key in newState) {
        if (newState[key] === this.state[key]) {
          delete newState[key];
        }
      }
      if (Object.keys(newState).length) {
        this.setState(newState);
      }
    });
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    this.unsubscribe();
    this.stateManager.syncHandler.syncIfNeeded();
    window.removeEventListener('keydown', this.handleKeyDown);
  }
  getStateFromManager(stateManager) {
    const clientState = stateManager.getClientState();
    const localState = stateManager.getLocalState();
    return {
      totalAmountOfTasks: clientState.get('sortedOrder').size,
      completionPercentage: clientState.get('completion_percentage'),
      maxIndention: localState.get('maxIndention'),
      visibleOrder: localState.get('visibleOrder'),
      projectName: clientState.get('name')
    };
  }
  onStateChange = state => this.setState(state);
  onSliderChange = e => {
    const depth = parseInt(e.target.value, 10);
    this.stateManager.expandHandler.setDepth(depth);
    this.setState({ sliderValue: depth });
  };
  handleProjectChat = () => {
    const { project, nav } = this.props;
    nav.openRight({
      screenId: 'DiscussionOverview',
      title: 'Chat',
      props: {
        discussionId: project.get('discussion_id')
      }
    });
  };
  handleKeyDown = e => {
    const localState = this.stateManager.getLocalState();

    const selectedId = localState.get('selectedId');
    if (!selectedId) return;
    if (e.keyCode === 8) {
      // Backspace
      if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
        e.preventDefault();
        this.stateManager.editHandler.delete(selectedId);
      }
    } else if (e.keyCode === 9) {
      // Tab
      e.preventDefault();
      if (e.shiftKey) this.stateManager.indentHandler.outdent(selectedId);
      else this.stateManager.indentHandler.indent(selectedId);
    } else if (e.keyCode === 13) {
      e.preventDefault();
      this.stateManager.editHandler.enter(selectedId, e.target.selectionStart);
    } else if (e.keyCode === 37) {
      // Left arrow
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        this.stateManager.expandHandler.collapse(selectedId);
      }
    } else if (e.keyCode === 38) {
      // Up arrow
      e.preventDefault();
      this.stateManager.selectHandler.selectPrev(e.target.selectionStart);
    } else if (e.keyCode === 39) {
      // Right arrow
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        this.stateManager.expandHandler.expand(selectedId);
      }
    } else if (e.keyCode === 40) {
      // Down arrow
      e.preventDefault();
      this.stateManager.selectHandler.selectNext(e.target.selectionStart);
    } else if (e.keyCode === 90 && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (e.shiftKey) {
        this.stateManager.undoHandler.redo();
      } else {
        this.stateManager.undoHandler.undo();
      }
    }
  };
  increaseSlider = () => {
    const { sliderValue } = this.state;
    this.stateManager.expandHandler.setDepth(sliderValue + 1);
    this.setState({ sliderValue: sliderValue + 1 });
  };
  decreaseSlider = () => {
    const { sliderValue } = this.state;
    this.stateManager.expandHandler.setDepth(sliderValue - 1);
    this.setState({ sliderValue: sliderValue - 1 });
  };

  renderSidebar = () => {
    const {
      maxIndention,
      sliderValue,
      totalAmountOfTasks,
      completionPercentage
    } = this.state;
    const { project } = this.props;
    const completedTasksAmount = Math.round(
      (completionPercentage / 100) * totalAmountOfTasks
    );
    return (
      <SW.SidebarWrapper>
        <SW.TasksTracker>
          <SW.CompletedTasks>{completedTasksAmount}</SW.CompletedTasks>
          <SW.TotalTasks>/{totalAmountOfTasks}</SW.TotalTasks>
        </SW.TasksTracker>
        <SW.Text>Tasks Completed</SW.Text>
        <SW.ProgressBarWrapper>
          <SW.ProgressBarOuter>
            <SW.ProgressBarInner width={completionPercentage} />
          </SW.ProgressBarOuter>
        </SW.ProgressBarWrapper>
        <SW.SliderWrapper>
          <SW.StepSlider
            min={0}
            max={maxIndention}
            sliderValue={sliderValue}
            onSliderChange={this.onSliderChange}
            increase={this.increaseSlider}
            decrease={this.decreaseSlider}
          />
        </SW.SliderWrapper>
        {project.get('discussion_id') && (
          <Button.Standard
            title="Project chat"
            icon="Comment"
            onClick={this.handleProjectChat}
          />
        )}
      </SW.SidebarWrapper>
    );
  };

  render() {
    const { visibleOrder, projectName } = this.state;

    return (
      <SWView noframe header={<CardHeader padding={30} title={projectName} />}>
        <ProjectProvider stateManager={this.stateManager}>
          <SW.Wrapper>
            {this.renderSidebar()}
            <SW.TasksWrapper>
              {visibleOrder.map(taskId => (
                <ProjectTask key={taskId} taskId={taskId} />
              ))}
            </SW.TasksWrapper>
          </SW.Wrapper>
        </ProjectProvider>
      </SWView>
    );
  }
}
