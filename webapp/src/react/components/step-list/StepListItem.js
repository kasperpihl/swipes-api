import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
// import './styles/step-list-item.scss';

class StepListItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderEditStep(step, i) {
    const { delegate, getLoading } = this.props;
    const { stepTitles } = this.state;
    let className = 'step-list-item step-list-item--editing';
    let title = stepTitles.get(step.get('id')) || step.get('title');
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
            onClick={this.onRemoveCached(i)}
          />
        </div>
        <input
          type="text"
          className="step-list-item__input"
          onKeyDown={this.onKeyDownCached(i)}
          onBlur={this.onBlurCached(i)}
          value={title}
          onChange={this.onChangeCached(i)}
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
  renderStep(step, i) {
    const { delegate, getLoading, isLoading, editMode } = this.props;
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

    if(step.get('completed')) {
      className += ' step-list-item--completed';
    } else {
      className += ' step-list-item--current';
    }

    return (
      <div className={className}>
        <div className="step-list-item__indicator" onClick={this.onCheck(i)}>
          <div className="indicator">
            <div className="indicator__number"></div>
            <div className="indicator__icon">
              <Icon icon={hoverIcon} className="indicator__svg" />
            </div>
          </div>
        </div>
        <div className="step-list-item__title">
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
  render() {
    return (
      <div className="className" />
    )
  }
}

export default StepListItem

// const { string } = PropTypes;

StepListItem.propTypes = {};
