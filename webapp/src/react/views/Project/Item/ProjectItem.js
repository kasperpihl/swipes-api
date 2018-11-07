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
      isFocused: false
    };
  }
  componentDidMount() {
    this.checkFocus();
  }
  componentDidUpdate() {
    this.checkFocus();
  }
  onFocus = e => {
    const { item, stateManager } = this.props;
    // onFocus(item.get('id'), e);
    stateManager.selectHandler.selectWithId(item.get('id'));
    this.setState({ isFocused: true });
  };
  onChange = e => {
    const { stateManager, item } = this.props;
    stateManager.editHandler.updateTitle(item.get('id'), e.target.value);
  };
  onBlur = e => {
    const { stateManager, item } = this.props;
    stateManager.selectHandler.deselectId(item.get('id'));
    // onBlur(item.get('id'), e);
    this.setState({ isFocused: false });
  };
  onAddedAttachment(attachment) {
    const { stateManager, item } = this.props;
    stateManager.editHandler.addAttachment(item.get('id'), attachment);
  }
  onExpandClick = () => {
    const { stateManager, item } = this.props;
    stateManager.expandHandler.toggleExpandForId(item.get('id'));
  };
  onAssigningClose(assignees) {
    const { stateManager, item } = this.props;
    if (!this._unmounted && assignees && onChangeAssignees) {
      stateManager.editHandler.updateAssignees(item.get('id'), assignees);
    }
  }
  checkFocus() {
    const { focus, selectionStart, item } = this.props;
    const { isFocused } = this.state;
    if (focus && !isFocused) {
      this.inputRef.focus();
      if (typeof selectionStart === 'number') {
        const selI = Math.min(
          item.getIn(['meta', 'title']).length,
          selectionStart
        );

        this.inputRef.setSelectionRange(selI, selI);
      }
    } else if (!focus && isFocused) {
      this.inputRef.blur();
    }
  }
  renderType() {
    return <SW.Checkbox />;
  }
  render() {
    const { item, isDone } = this.props;
    const { isFocused } = this.state;

    const title = item.getIn(['meta', 'title']);
    return (
      <SwissProvider selected={isFocused}>
        <SW.Wrapper
          done={isDone}
          indent={item.get('indent')}
          className="item-class"
        >
          <SW.ExpandWrapper onClick={this.onExpandClick}>
            {item.get('hasChildren') && (
              <SW.ExpandIcon
                icon="ArrowRightFull"
                expanded={item.get('expanded')}
              />
            )}
          </SW.ExpandWrapper>
          <SW.CheckboxWrapper>{this.renderType()}</SW.CheckboxWrapper>
          <SW.Input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            value={title}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            placeholder="# title, +attach"
            innerRef={c => {
              this.inputRef = c;
            }}
          />
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}
