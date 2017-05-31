import React, { PureComponent } from 'react'
import { SortableElement } from 'react-sortable-hoc';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
import Button from 'Button';
import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning';
// import './styles/step-list-item.scss';

class StepListItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {};
    setupDelegate(this);
    this.callDelegate.bindAll('onStepCheck', 'onStepRemove', 'onStepClick');
    bindAll(this, ['onChange', 'onBlur', 'onKeyDown']);
  }
  componentDidMount() {
  }
  onKeyDown(e) {
    if (e.keyCode === 13 && e.target.value.length > 0) {
      e.target.blur();
      this.saveTitle();
    }
  }
  onChange(e) {
    this.setState({title: e.target.value});
  }
  onBlur(e) {
    this.saveTitle();
  }
  saveTitle() {
    const { title } = this.state;
    const { step, i } = this.props;

    if(title && title.length && title !== step.get('title')){
      this.callDelegate('onStepRename', i, title);
      this.setState({title: null});
    }
  }
  renderEditStep(step, i) {
    const { delegate, getLoading } = this.props;
    let { title } = this.state;
    title = title || step.get('title');
    let className = 'step-list-item step-list-item--editing';

    if (getLoading(step.get('id')).loading) {
      title = getLoading(step.get('id')).loadingLabel;
      className += ' step-list-item--loading';
    }

    return (
      <div className={className}>
        <div className="step-list-item__remove" >
          <Button
            icon="Trash"
            className="step-list-item__remove--button"
            onClick={this.onStepRemoveCached(i)}
          />
        </div>
        <input
          type="text"
          className="step-list-item__input"
          onKeyDown={this.onKeyDown}
          onBlur={this.onBlur}
          value={title}
          onChange={this.onChange}
          placeholder="Enter the step title"
        />
        <div className="step-list-item__assignees">
          <HOCAssigning
            delegate={delegate}
            index={i}
            assignees={step.get('assignees')}
            rounded
            size={24}
          />
        </div>
      </div>
    );
  }

  render() {
    const {
      delegate,
      getLoading,
      isLoading,
      editMode,
      step,
      i,
    } = this.props;

    if (editMode) {
      return this.renderEditStep(step, i);
    }

    let hoverIcon = 'ActivityCheckmark';
    let className = 'step-list-item';

    let title = step.get('title');
    if (isLoading(step.get('id'))) {
      title = getLoading(step.get('id')).loadingLabel;
      className += ' step-list-item--loading';
    }

    if(step.get('completed_at')) {
      hoverIcon = 'Iteration';
      className += ' step-list-item--completed';
    } else {
      className += ' step-list-item--current';
    }

    return (
      <div className={className}>
        <div className="step-list-item__indicator" onClick={this.onStepCheckCached(i)}>
          <div className="indicator">
            <div className="indicator__number">{ i + 1 }</div>
            <div className="indicator__icon">
              <Icon icon={hoverIcon} className="indicator__svg" />
            </div>
          </div>
        </div>
        <div className="step-list-item__title" onClick={this.onStepClickCached(i)}>
          {title}
        </div>
        <div className="step-list-item__assignees">
          <HOCAssigning
            delegate={delegate}
            index={i}
            assignees={step.get('assignees')}
            rounded
            size={24}
          />
        </div>
      </div>
    );
  }
}

export default SortableElement(StepListItem)

// const { string } = PropTypes;

StepListItem.propTypes = {};