import React, { PureComponent } from 'react';
import SW from './ProjectOverview.swiss';
import withRequests from 'swipes-core-js/components/withRequests';
import ProjectStateManager from 'src/utils/project/ProjectStateManager';
import ProjectItem from 'src/react/views/Project/Item/ProjectItem';
import StepSlider from 'src/react/components/step-slider/StepSlider';
import ProgreessCircle from 'src/react/components/progress-circle/ProgressCircle';
import Button from 'src/react/components/button/Button';

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
    this.state = {
      sliderTestValue: 0,
      showPopupText: false,
    };
  }
  componentWillMount() {
    this.stateManager = new ProjectStateManager(
      this.props.project,
      this.onStateChange
    );
    this.setState(this.stateManager.getState());
  }
  componentWillUnmount() {
    this.stateManager.destroy();
  }
  onStateChange = state => this.setState(state);
  onSliderChange = e => {
    const depth = parseInt(e.target.value, 10);
    this.stateManager.indentHandler.enforceIndention(depth);
  };
  onAdd = () => {
    this.stateManager.editHandler.add();
  };
  componentDidUpdate() {
    if (typeof this.focusI === 'number') {
      this.focusI = undefined;
      this.selectionStart = undefined;
    }
  }
  increaseSlider = () => {
    const { sliderTestValue } = this.state;
    this.setState({ sliderTestValue: sliderTestValue + 1})
  }
  decreaseSlider = () => {
    const { sliderTestValue } = this.state;
    this.setState({ sliderTestValue: sliderTestValue - 1})
  }
  renderItems() {
    const { visibleOrder, selectedIndex, selectionStart } = this.state;
    return visibleOrder.map((item, i) => (
      <ProjectItem
        focus={i === selectedIndex}
        selectionStart={i === selectedIndex && selectionStart}
        item={item}
        key={item.get('id')}
        stateManager={this.stateManager}
      />
    ));
  }

  showPopupText = (e) => {
    this.timeout = setTimeout(() => {
      this.setState({ showPopupText: true });
    }, 700)
  }
  hidePopupText = (e) => {
    clearTimeout(this.timeout);
    this.setState({ showPopupText: false });
  }

  render() {
    const { sliderTestValue, showPopupText } = this.state;
    
    return (
      <SW.Wrapper>
        <SW.Header>
          <SW.HeaderTitle>Discussions Release</SW.HeaderTitle>
          <StepSlider 
            min={0}
            max={4}
            sliderValue={sliderTestValue}
            onSliderChange={this.onSliderChange}
            increase={this.increaseSlider}
            decrease={this.decreaseSlider}
          />
        </SW.Header>
        {this.renderItems()}
        <SW.AddButton
          onClick={this.onAdd}
          title="Add item"
          icon="Plus"
        />
        <ProgreessCircle progress={6}/>
        <SW.Div>
          <Button  
            onMouseEnter={this.showPopupText}
            onMouseLeave={this.hidePopupText}
            icon='Trash'
            title='Start new plan'
            popupText='Testing popup'
            size='large'
            rounded={true}
            showPopupText={showPopupText} 
            numberOfLines={1}
          />
        </SW.Div>
      </SW.Wrapper>
    );
  }
}
