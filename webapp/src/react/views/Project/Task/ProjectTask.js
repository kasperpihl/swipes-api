import React, { PureComponent } from 'react';
import Icon from 'src/react/icons/Icon';

import SW from './ProjectTask.swiss';
import withProjectTask from 'swipes-core-js/components/project/withProjectTask';

@withProjectTask
export default class ProjectTask extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false
    };
  }
  componentDidMount() {
    // Wait for sibling components to have re-rendered
    setTimeout(this.checkFocus, 0);
  }
  componentDidUpdate() {
    // Wait for all components to have re-rendered
    setTimeout(this.checkFocus, 0);
  }
  componentWillUnmount() {
    this._unmounted = true;
  }

  onFocus = () => {
    const { taskId, stateManager } = this.props;
    stateManager.selectHandler.select(taskId);
    this.setState({ isFocused: true });
  };
  onBlur = () => {
    const { stateManager, taskId } = this.props;
    stateManager.selectHandler.deselect(taskId);
    this.setState({ isFocused: false });
  };
  onComplete = e => {
    const { taskId, stateManager, task } = this.props;
    const { completion } = task;
    if (completion) {
      stateManager.completeHandler.incomplete(taskId);
    } else {
      stateManager.completeHandler.complete(taskId);
    }
  };
  onChange = e => {
    const { stateManager, taskId } = this.props;
    stateManager.editHandler.updateTitle(taskId, e.target.value);
  };
  onExpandClick = () => {
    const { stateManager, taskId, task } = this.props;
    const { expanded } = task;
    stateManager.expandHandler[expanded ? 'collapse' : 'expand'](taskId);
  };
  onAssigningClose(assignees) {
    const { stateManager, taskId } = this.props;
    if (!this._unmounted && assignees && onChangeAssignees) {
      stateManager.editHandler.updateAssignees(taskId, assignees);
    }
  }
  checkFocus = () => {
    if (this._unmounted) return;
    const { isSelected, selectionStart, title } = this.props.task;
    const { isFocused } = this.state;
    if (isSelected && !isFocused) {
      this.inputRef.focus();
      if (typeof selectionStart === 'number') {
        const selI = Math.min(title.length, selectionStart);

        this.inputRef.setSelectionRange(selI, selI);
      }
    } else if (!isSelected && isFocused) {
      this.inputRef.blur();
    }
  };
  render() {
    const {
      title,
      completion,
      indention,
      hasChildren,
      expanded
    } = this.props.task;
    const { isFocused } = this.state;

    return (
      <SW.ProvideContext selected={isFocused} done={completion}>
        <SW.Wrapper indention={indention} className="js-item-class">
          <SW.ExpandWrapper onClick={this.onExpandClick}>
            {hasChildren && (
              <SW.ExpandIcon icon="ArrowRightFull" expanded={expanded} />
            )}
          </SW.ExpandWrapper>
          <SW.CheckboxWrapper
            className="js-checkbox-wrapper"
            onClick={this.onComplete}
          >
            <SW.Checkbox checked={completion}>
              {completion && (
                <Icon icon="Checkmark" fill="#FFFFFF" width="18" />
              )}
            </SW.Checkbox>
          </SW.CheckboxWrapper>
          <SW.Input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            value={title}
            onChange={this.onChange}
            placeholder="Write a task"
            innerRef={c => {
              this.inputRef = c;
            }}
          />
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
