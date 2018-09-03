import React, { PureComponent } from 'react';
import HOCAssigning from 'components/assigning/HOCAssigning';
import AttachButton from 'src/react/components/attach-button/AttachButton';

import SW from './Item.swiss';

export default class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };
  }
  componentDidMount() {
    this.checkFocus();
  }
  componentDidUpdate() {
    this.checkFocus();
  }
  onFocus = e => {
    this.setState({ isFocused: true });
  };
  onChange = e => {
    const { onChangeTitle, item } = this.props;
    onChangeTitle(item.get('id'), e.target.value);
  };
  onBlur = e => {
    this.setState({ isFocused: false });
  };
  onAddedAttachment(att) {
    const { onAttachmentAdd, item } = this.props;
    onAttachmentAdd(item.get('id'), att);
  }
  onKeyDown = e => {
    const {
      item,
      onEnter,
      onUpArrow,
      onDownArrow,
      onDelete,
      onTab,
    } = this.props;

    const id = item.get('id');

    if (e.keyCode === 8) {
      // Backspace
      if (
        e.target.selectionStart === 0 &&
        e.target.selectionEnd === 0 &&
        onDelete
      ) {
        e.preventDefault();
        onDelete(id);
      }
    } else if (e.keyCode === 9 && onTab) {
      // Tab
      e.preventDefault();
      onTab(id, e);
    } else if (e.keyCode === 13 && onEnter) {
      // Enter
      e.preventDefault();
      onEnter(id, e.target.selectionStart);
    } else if (e.keyCode === 38 && onUpArrow) {
      // Up arrow
      e.preventDefault();
      onUpArrow(id, e.target.selectionStart);
    } else if (e.keyCode === 40 && onDownArrow) {
      // Down arrow
      e.preventDefault();
      onDownArrow(id, e.target.selectionStart);
    }
  };
  onCollapseClick = () => {
    const { onCollapse, item } = this.props;
    onCollapse && onCollapse(item.get('id'));
  };
  onAssigningClose(assignees) {
    const { onChangeAssignees, item } = this.props;
    if (!this._unmounted && assignees && onChangeAssignees) {
      onChangeAssignees(item.get('id'), assignees);
    }
  }
  checkFocus() {
    const { focus, selectionStart, item } = this.props;
    if (focus) {
      this.inputRef.focus();
      if (typeof selectionStart === 'number') {
        const selI = Math.min(item.get('title').length, selectionStart);

        this.inputRef.setSelectionRange(selI, selI);
      }
    }
  }
  renderType() {
    const { item } = this.props;

    if (item.get('type') === 'attachment') {
      return 'x';
    }

    return <SW.Checkbox />;
  }
  render() {
    const { item, orderItem } = this.props;

    return (
      <SW.Wrapper indent={orderItem.get('indent')} className="item-class">
        <SW.CollapseWrapper onClick={this.onCollapseClick}>
          {item.get('type') !== 'attachment' &&
            orderItem.get('hasChildren') && (
              <SW.CollapseIcon
                icon="ArrowRightFull"
                collapsed={orderItem.get('collapsed')}
              />
            )}
        </SW.CollapseWrapper>
        <SW.CheckboxWrapper>{this.renderType()}</SW.CheckboxWrapper>
        <SW.Input
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          value={item.get('title')}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          placeholder="# title, +attach"
          innerRef={c => {
            this.inputRef = c;
          }}
        />
        {item.get('title') && (
          <SW.AssigneeWrapper
            hide={!item.get('assignees') || !item.get('assignees').size}
          >
            <HOCAssigning
              assignees={item.get('assignees')}
              maxImages={5}
              size={24}
              delegate={this}
              enableTooltip
              buttonProps={{
                compact: true,
              }}
            />
          </SW.AssigneeWrapper>
        )}
        {!item.get('title') && (
          <AttachButton delegate={this} buttonProps={{ compact: true }} />
        )}
      </SW.Wrapper>
    );
  }
}
