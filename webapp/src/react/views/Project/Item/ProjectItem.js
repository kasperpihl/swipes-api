import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import Icon from 'src/react/icons/Icon';

import SW from './ProjectItem.swiss';
import withProjectTask from 'src/utils/project/provider/withProjectTask';

@withProjectTask
export default class ProjectItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false
    };
  }
  componentDidMount() {
    this.checkFocus();
  }
  componentDidUpdate() {
    this.checkFocus();
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
    const { taskId, completion, stateManager } = this.props;
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
    const { stateManager, taskId, expanded } = this.props;
    stateManager.expandHandler[expanded ? 'collapse' : 'expand'](taskId);
  };
  onAssigningClose(assignees) {
    const { stateManager, taskId } = this.props;
    if (!this._unmounted && assignees && onChangeAssignees) {
      stateManager.editHandler.updateAssignees(taskId, assignees);
    }
  }
  checkFocus() {
    const { isSelected, selectionStart, title } = this.props;
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
  }
  render() {
    const { title, completion, indention, hasChildren, expanded } = this.props;
    const { isFocused } = this.state;

    return (
      <SwissProvider selected={isFocused} done={completion}>
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
            onKeyDown={this.onKeyDown}
            placeholder="Write a task"
            innerRef={c => {
              this.inputRef = c;
            }}
          />
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}
