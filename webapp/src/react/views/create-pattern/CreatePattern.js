import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Textarea from 'react-textarea-autosize';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Icon from 'Icon';
import { bindAll } from 'classes/utils';

import './styles/create-pattern.scss';

class CreatePattern extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [
        {
          icon: 'CheckmarkIcon',
          title: 'Checklist',
          description: 'Create a checklist for actions. Create a checklist for actions. Create a checklist for actions.',
        },
        {
          icon: 'VoteIcon',
          title: 'Vote',
          description: 'Create a checklist for actions. Create a checklist for actions. Create a checklist for actions.',
        },
        {
          icon: 'DeliverIcon',
          title: 'Deliverable',
          description: 'Create a checklist for actions. Create a checklist for actions. Create a checklist for actions.',
        },
        {
          icon: 'ListIcon',
          title: 'Read Me',
          description: 'Create a checklist for actions. Create a checklist for actions. Create a checklist for actions.',
        },
      ],
      selectedSteps: [],
      showSidebar: false,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['addStep', 'showSidebar']);
  }
  componentDidMount() {
    setTimeout(() => {
      this.refs.input.focus();
    }, 0);
  }
  addStep(i) {
    const { selectedSteps } = this.state;
    selectedSteps.push(i);

    this.setState({ selectedSteps });
    this.setState({ showSidebar: false });
  }
  showSidebar() {
    this.setState({ showSidebar: true });
  }
  renderIcon(icon) {
    return <Icon svg={icon} className="create-pattern__icon" />;
  }
  renderSidebar() {
    const { showSidebar, steps } = this.state;
    let className = 'create-pattern__sidebar';

    if (showSidebar) {
      className += ' create-pattern__sidebar--shown';
    }

    const renderSteps = steps.map((step, i) =>
      <SidebarItem
        icon={step.icon}
        title={step.title}
        description={step.description}
        index={i}
        callback={this.addStep}
        renderIcon={this.renderIcon}
      />,
    );

    return (
      <div className={className}>
        <div className="create-pattern__sidebar-header">
          Add an action step
          <div className="create-pattern__button create-pattern__button--close-sidebar">{this.renderIcon('CloseIcon')}</div>
        </div>
        {renderSteps}
      </div>
    );
  }
  renderHeader() {
    return (
      <div className="create-pattern__header">
        <div className="create-pattern__pattern-icon">{this.renderIcon('ShapeEight')}</div>
        <div className="create-pattern__vertical-flex">
          <input
            ref="input"
            type="text"
            className="create-pattern__title create-pattern__title--input"
            placeholder="Name your pattern"
          />
          <Textarea className="create-pattern__description create-pattern__description--textarea" minRows={1} maxRows={2} placeholder={'Give it a short description'} />
        </div>
      </div>
    );
  }
  renderStepList() {
    const { selectedSteps, steps } = this.state;

    if (selectedSteps.length < 1) {
      return undefined;
    }

    const renderSelectedSteps = [];

    selectedSteps.forEach((selectedStep, i) => {
      renderSelectedSteps.push(this.renderStepItem(steps[selectedStep].title, i));
    });

    return (
      <div className="create-pattern__step-list">
        {renderSelectedSteps}
      </div>
    );
  }
  renderStepItem(title, i) {
    if (this.refs.stepItemInput) {
      this.refs.stepItemInput.focus();
    }

    return (
      <div className="create-pattern__step-item" key={`step-item-${i}`}>
        <div className="create-pattern__step-index">{i + 1}</div>
        <div className="create-pattern__vertical-flex">
          <input
            ref="stepItemInput"
            type="text"
            className="create-pattern__step-name"
            placeholder="Enter Step Name"
          />
          <div className="create-pattern__step-title">{title}</div>
        </div>
      </div>
    );
  }
  renderAddStep() {
    return (
      <div className="create-pattern__add-step" onClick={this.showSidebar}>
        <div className="create-pattern__button create-pattern__button--add-step">{this.renderIcon('AddIcon')}</div>
        add step
      </div>
    );
  }
  render() {
    return (
      <div className="create-pattern">
        <div className="create-pattern__wrapper">
          {this.renderSidebar()}
          {this.renderHeader()}
          {this.renderStepList()}
          {this.renderAddStep()}
          <div className="create-pattern__button create-pattern__button--create-pattern">
            Create Pattern
          </div>
        </div>
      </div>
    );
  }
}

const SidebarItem = props => (
  <div className="create-pattern__sidebar-item" onClick={props.callback(props.index)} key={`sidebar-item-${props.index}`}>
    <div className="create-pattern__sidebar-icon">{props.renderIcon(props.icon)}</div>
    <div className="create-pattern__vertical-flex">
      <div className="create-pattern__sidebar-title">{props.title}</div>
      <div className="create-pattern__sidebar-description">{props.description}</div>
    </div>
  </div>
  );

const ConnectedCreatePattern = connect(null, {})(CreatePattern);

export default ConnectedCreatePattern;

const { func, number, string } = PropTypes;

SidebarItem.propTypes = {
  callback: func,
  index: number,
  renderIcon: func,
  icon: string,
  title: string,
  description: string,
};
