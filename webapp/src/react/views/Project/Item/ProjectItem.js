import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import HOCAssigning from 'components/assigning/HOCAssigning';
import AttachButton from 'src/react/components/attach-button/AttachButton';
import { attachmentIconForService } from 'swipes-core-js/classes/utils';
import Icon from 'src/react/icons/Icon';

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
  onFocus = () => {
    const { item, stateManager } = this.props;
    // onFocus(item.get('item_id'), e);
    stateManager.selectHandler.select(item.get('item_id'));
    this.setState({ isFocused: true });
  };
  onComplete = e => {
    const { item, stateManager } = this.props;
    console.log('complete', item.get('item_id'));
    if (item.get('completion')) {
      stateManager.completeHandler.incomplete(item.get('item_id'));
    } else {
      stateManager.completeHandler.complete(item.get('item_id'));
    }
  };
  onChange = e => {
    const { stateManager, item } = this.props;
    stateManager.editHandler.updateTitle(item.get('item_id'), e.target.value);
  };
  onBlur = () => {
    const { stateManager, item } = this.props;
    stateManager.selectHandler.deselect(item.get('item_id'));
    this.setState({ isFocused: false });
  };
  onExpandClick = () => {
    const { stateManager, item } = this.props;
    stateManager.expandHandler[item.get('expanded') ? 'collapse' : 'expand'](
      item.get('item_id')
    );
  };
  onAssigningClose(assignees) {
    const { stateManager, item } = this.props;
    if (!this._unmounted && assignees && onChangeAssignees) {
      stateManager.editHandler.updateAssignees(item.get('item_id'), assignees);
    }
  }
  checkFocus() {
    const { focus, selectionStart, item } = this.props;
    const { isFocused } = this.state;
    if (focus && !isFocused) {
      this.inputRef.focus();
      if (typeof selectionStart === 'number') {
        const selI = Math.min(item.get('title').length, selectionStart);

        this.inputRef.setSelectionRange(selI, selI);
      }
    } else if (!focus && isFocused) {
      this.inputRef.blur();
    }
  }
  render() {
    const { item } = this.props;
    const { isFocused } = this.state;

    const title = item.get('title');
    return (
      <SwissProvider selected={isFocused} done={item.get('completion')}>
        <SW.Wrapper indent={item.get('indent')} className="js-item-class">
          <SW.ExpandWrapper onClick={this.onExpandClick}>
            {item.get('hasChildren') && (
              <SW.ExpandIcon
                icon="ArrowRightFull"
                expanded={item.get('expanded')}
              />
            )}
          </SW.ExpandWrapper>
          <SW.CheckboxWrapper
            className="js-checkbox-wrapper"
            onClick={this.onComplete}
          >
            <SW.Checkbox checked={item.get('completion')}>
              {item.get('completion') && (
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
