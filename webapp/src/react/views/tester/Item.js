import React, { PureComponent } from 'react';
import SW from './Item.swiss';

export default class Item extends PureComponent {
  componentDidMount() {
    this.checkFocus();
  }
  componentDidUpdate() {
    this.checkFocus();
  }
  onChange = (e) => {
    const { onChange, item } = this.props;
    onChange(item.get('id'), e.target.value);
  }
  onKeyDown = (e) => {
    const {
      item,
      onEnter,
      onUpArrow,
      onDownArrow,
      onDelete,
      onTab,
    } = this.props;
    const id = item.get('id');

    if(e.keyCode === 8) { // Backspace
      if(e.target.selectionStart === 0 && onDelete) {
        e.preventDefault();
        onDelete(id);
      }
    }
    else if(e.keyCode === 9 && onTab) { // Tab
      e.preventDefault();
      onTab(id, e)
    }
    else if(e.keyCode === 13 && onEnter) { // Enter
      e.preventDefault();
      onEnter(id, e.target.selectionStart);
    }
    else if(e.keyCode === 38 && onUpArrow) { // Up arrow
      e.preventDefault();
      onUpArrow(id, e.target.selectionStart);
    } else if(e.keyCode === 40 && onDownArrow) { // Down arrow
      e.preventDefault();
      onDownArrow(id, e.target.selectionStart);
    }
  }
  onCollapseClick = () => {
    const { onCollapse, item } = this.props;
    onCollapse && onCollapse(item.get('id'));
  }
  
  checkFocus() {
    const { focus, selectionStart, item } = this.props;
    if(focus) {
      this.inputRef.focus();
      if(typeof selectionStart === 'number') {
        const selI = Math.min(item.get('title').length, selectionStart);
        console.log('setting', selI);

        this.inputRef.setSelectionRange(selI, selI);
      }
    }
  }
  render() {
    const { item, orderItem } = this.props;

    return (
      <SW.Wrapper indent={orderItem.get('indent')}>
        <SW.CollapseWrapper onClick={this.onCollapseClick}>
          {orderItem.get('hasChildren') && (
            <SW.CollapseIcon icon="ArrowRightFull" collapsed={orderItem.get('collapsed')} />
          )}
        </SW.CollapseWrapper>
        <SW.CheckboxWrapper>
          <SW.Checkbox />
        </SW.CheckboxWrapper>
        <SW.Input
          value={item.get('title')}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          placeholder="Add title"
          innerRef={(c) => { this.inputRef = c}}
        />          
      </SW.Wrapper>
    );
  }
}
