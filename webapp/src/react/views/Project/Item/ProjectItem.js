import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import HOCAssigning from 'components/assigning/HOCAssigning';
import AttachButton from 'src/react/components/attach-button/AttachButton';
import { attachmentIconForService } from 'swipes-core-js/classes/utils';

import SW from './ProjectItem.swiss';

export default class ProjectItem extends PureComponent {
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
  onExpandClick = () => {
    const { onExpand, item } = this.props;
    onExpand && onExpand(item.get('id'));
  };
  onAssigningClose(assignees) {
    const { onChangeAssignees, item } = this.props;
    if (!this._unmounted && assignees && onChangeAssignees) {
      onChangeAssignees(item.get('id'), assignees);
    }
  }
  checkFocus() {
    const { focus, selectionStart, item } = this.props;
    if (focus && this.didCheckFocus !== focus) {
      this.didCheckFocus = focus;
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
      return (
        <SW.AttachmentIcon
          icon={attachmentIconForService(
            item.getIn(['attachment', 'link', 'service'])
          )}
        />
      );
    }

    return <SW.Checkbox />;
  }
  render() {
    const { item, orderItem, selected } = this.props;

    return (
      <SwissProvider selected={selected}>
        <SW.Wrapper indent={orderItem.get('indent')} className="item-class">
          <SW.ExpandWrapper onClick={this.onExpandClick}>
            {item.get('type') !== 'attachment' &&
              orderItem.get('hasChildren') && (
                <SW.ExpandIcon
                  icon="ArrowRightFull"
                  expanded={orderItem.get('expanded')}
                />
              )}
          </SW.ExpandWrapper>
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
          {item.get('type') !== 'attachment' &&
            item.get('title') && (
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
      </SwissProvider>
    );
  }
}
