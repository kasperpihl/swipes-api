import React, { PureComponent } from 'react';
import SW from './ProjectOverview.swiss';
import withRequests from 'swipes-core-js/components/withRequests';
import ProjectStateManager from 'src/utils/project/ProjectStateManager';
import ProjectItem from 'src/react/views/Project/Item/ProjectItem';
import StepSlider from 'src/react/components/step-slider/StepSlider';
import ProgreessCircle from 'src/react/components/progress-circle/ProgressCircle';
import Button from 'src/react/components/button/Button';
import Dropdown from 'src/react/components/dropdown/Dropdown';
import { fromJS } from 'immutable';
import ProjectProvider from 'src/utils/project/provider/ProjectProvider';

@withRequests(
  {
    project: {
      request: {
        url: 'project.get',
        body: props => ({
          project_id: 'A123131'
        }),
        resPath: 'result'
      },
      cache: {
        path: props => ['project', 'A123131']
      }
    }
  },
  { renderLoader: () => <div>loading</div> }
)
export default class ProjectOverview extends PureComponent {
  static sizes() {
    return [654];
  }
  constructor(props) {
    super(props);
    this.stateManager = new ProjectStateManager(props.project);
    this.state = {
      sliderTestValue: 0,
      showPopupText: false,
      visibleOrder: this.stateManager.getLocalState().get('visibleOrder')
    };
  }
  componentDidMount() {
    this.unsubscribe = this.stateManager.subscribe(stateManager => {
      const visibleOrder = stateManager.getLocalState().get('visibleOrder');
      if (visibleOrder !== this.state.visibleOrder) {
        this.setState({ visibleOrder });
      }
    });
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    this.unsubscribe();
    window.removeEventListener('keydown', this.handleKeyDown);
  }
  onStateChange = state => this.setState(state);
  onSliderChange = e => {
    const depth = parseInt(e.target.value, 10);
    this.stateManager.expandHandler.setDepth(depth);
    this.setState({ sliderTestValue: depth });
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
    const { sliderTestValue } = this.state;
    this.stateManager.expandHandler.setDepth(sliderTestValue + 1);
    this.setState({ sliderTestValue: sliderTestValue + 1 });
  };
  decreaseSlider = () => {
    const { sliderTestValue } = this.state;
    this.stateManager.expandHandler.setDepth(sliderTestValue - 1);
    this.setState({ sliderTestValue: sliderTestValue - 1 });
  };
  renderItems() {
    const { visibleOrder } = this.state;

    return visibleOrder.map((taskId, i) => (
      <ProjectItem key={taskId} taskId={taskId} />
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

  render() {
    const { sliderTestValue, showPopupText } = this.state;

    return (
      <ProjectProvider stateManager={this.stateManager}>
        <SW.Wrapper>
          <SW.Header>
            <SW.HeaderTitle>Discussions Release</SW.HeaderTitle>
          </SW.Header>
          {this.renderItems()}
          <SW.Div>
            <StepSlider
              min={0}
              max={4}
              sliderValue={sliderTestValue}
              onSliderChange={this.onSliderChange}
              increase={this.increaseSlider}
              decrease={this.decreaseSlider}
            />
            <ProgreessCircle progress={6} />
            <Button
              onMouseEnter={this.showPopupText}
              onMouseLeave={this.hidePopupText}
              icon="Trash"
              title="Start new plan"
              popupText="Testing popup"
              size="large"
              rounded={true}
              showPopupText={showPopupText}
            />
            <Dropdown rounded={false} />
          </SW.Div>
        </SW.Wrapper>
      </ProjectProvider>
    );
  }
}
