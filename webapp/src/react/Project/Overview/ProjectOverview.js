import React, { PureComponent } from 'react';
import SW from './ProjectOverview.swiss';
import withRequests from 'swipes-core-js/components/withRequests';
import ProjectProvider from 'swipes-core-js/components/project/ProjectProvider';
import ProjectStateManager from 'swipes-core-js/classes/ProjectStateManager';
import ProjectTask from 'src/react/Project/Task/ProjectTask';
import SWView from 'src/react/_Layout/view-controller/SWView';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import Button from 'src/react/_components/Button/Button';

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
  static sizes() {
    return [750];
  }
  constructor(props) {
    super(props);
    this.stateManager = new ProjectStateManager(props.project);
    this.state = {
      sliderValue: 0,
      maxIndention: this.stateManager.getLocalState().get('maxIndention'),
      showPopupText: false,
      visibleOrder: this.stateManager.getLocalState().get('visibleOrder')
    };
  }
  componentDidMount() {
    this.unsubscribe = this.stateManager.subscribe(stateManager => {
      const localState = stateManager.getLocalState();
      const visibleOrder = localState.get('visibleOrder');
      if (visibleOrder !== this.state.visibleOrder) {
        this.setState({ visibleOrder });
      }
      const maxIndention = localState.get('maxIndention');
      if (maxIndention !== this.state.maxIndention) {
        this.setState({ maxIndention });
      }
    });
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    this.unsubscribe();
    this.stateManager.syncHandler.syncIfNeeded();
    window.removeEventListener('keydown', this.handleKeyDown);
  }
  onStateChange = state => this.setState(state);
  onSliderChange = e => {
    const depth = parseInt(e.target.value, 10);
    this.stateManager.expandHandler.setDepth(depth);
    this.setState({ sliderValue: depth });
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
  renderItems() {
    const { visibleOrder } = this.state;

    return visibleOrder.map((taskId, i) => (
      <ProjectTask key={taskId} taskId={taskId} />
    ));
  }

  showPopupText = e => {
    this.timeout = setTimeout(() => {
      this.setState({ showPopupText: true });
    }, 700);
  };
  hidePopupText = e => {
    clearTimeout(this.timeout);
    this.setState({ showPopupText: false });
  };

  renderSidebar = () => {
    const { maxIndention, sliderValue } = this.state;
    const clientState = this.stateManager.getClientState();
    const totalAmountOfTasks = clientState.get('sortedOrder').size;
    const completionPercentage = clientState.get('completion_percentage');
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
        <Button.Standard title="Project discussion" icon="Comment" />
      </SW.SidebarWrapper>
    );
  };

  render() {
    const clientState = this.stateManager.getClientState();

    return (
      <SWView
        noframe
        header={<CardHeader padding={30} title={clientState.get('name')} />}
      >
        <ProjectProvider stateManager={this.stateManager}>
          <SW.Wrapper>
            {this.renderSidebar()}
            <SW.TasksWrapper>{this.renderItems()}</SW.TasksWrapper>
          </SW.Wrapper>
        </ProjectProvider>
      </SWView>
    );
  }
}
