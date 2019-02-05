import React, { PureComponent } from 'react';
import Icon from 'src/react/_components/Icon/Icon';
import AssignMenu from 'src/react/_components/AssignMenu/AssignMenu';
import SW from './ProjectTask.swiss';
import withProjectTask from 'swipes-core-js/components/project/withProjectTask';
import Assignees from 'src/react/_components/Assignees/Assignees';
import contextMenu from 'src/utils/contextMenu';

@withProjectTask
export default class ProjectTask extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
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
  handleAssigneeSelect = followers => {
    const { stateManager, taskId } = this.props;
    stateManager.editHandler.updateAssignees(taskId, followers);
  };
  handleAssignClick = e => {
    const { stateManager, task } = this.props;
    contextMenu(AssignMenu, e, {
      excludeMe: false,
      selectedIds: task.assignees,
      organizationId: stateManager.getClientState().get('owned_by'),
      onSelect: this.handleAssigneeSelect
    });
  };
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
      assignees,
      completion,
      indention,
      hasChildren,
      expanded
    } = this.props.task;
    const { isFocused } = this.state;
    const { stateManager } = this.props;
    const ownedBy = stateManager.getClientState().get('owned_by');

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
          <SW.AssigneesWrapper hide={assignees.size === 0 && !isFocused}>
            <Assignees
              userIds={assignees}
              organizationId={ownedBy}
              size={24}
              maxImages={4}
              onClick={this.handleAssignClick}
            >
              <SW.Button
                icon="Person"
                onClick={this.handleAssignClick}
                selected={isFocused}
              />
            </Assignees>
          </SW.AssigneesWrapper>
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
