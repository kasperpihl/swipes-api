import React, { Component, PropTypes } from 'react';
import { setupCachedCallback, bindAll } from 'classes/utils';
import Button from 'Button';
import Icon from 'Icon';
import './styles/add-attachment';

class AddAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addMenu: false,
      buttons: [
        { title: 'Link', svg: 'Hyperlink' },
        { title: 'Note', svg: 'CreateNote' },
        { title: 'Find', svg: 'Find' },
      ],
    };
    this.onMenuCached = setupCachedCallback(this.onMenu, this);
    bindAll(this, ['onAdd', 'onHandleKeyUp']);
  }
  onMenu(i) {
    const { callback } = this.props;

    if (i === 0) {
      this.setState({ addMenu: 'link' });
    }
    if (i === 1) {
      this.setState({ addMenu: 'note' });
    }
    if (i === 2) {
      callback('find');
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.addMenu && this.state.addMenu) {
      this._input.focus();
    }
  }
  onHandleKeyUp(e) {
    if (e.keyCode === 13) {
      this.onAdd();
    }
  }
  onAdd() {
    const { callback } = this.props;
    const { addMenu } = this.state;
    if (addMenu === 'link') {
      callback('link', this._input.value);
    } else if (addMenu === 'note') {
      callback('note', this._input.value);
    }
  }
  renderAddMenu() {
    const { addMenu } = this.state;
    if (!addMenu) {
      return undefined;
    }
    const placeholder = addMenu === 'link' ? 'Enter a URL' : 'Enter note title';
    return (
      <div className="add-attachment__attach">
        <input
          key="input"
          className="add-attachment__input"
          placeholder={placeholder}
          onKeyUp={this.onHandleKeyUp}
          type="text"
          ref={(c) => { this._input = c; }}
        />
        <Button
          primary
          key="butt"
          text="Add"
          onClick={this.onAdd}
          className="add-attachment__button"
        />
      </div>
    );
  }
  renderButtons() {
    const { addMenu, buttons } = this.state;
    if (addMenu) {
      return undefined;
    }
    return buttons.map((b, i) => (
      <div key={`button-${i}`} className="add-attachment__item" onClick={this.onMenuCached(i)}>
        <Icon svg={b.svg} className="add-attachment__icon" />
        {b.title}
      </div>
    ));
  }
  render() {
    return (
      <div className="add-attachment">
        {this.renderAddMenu()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default AddAttachment;

const { func } = PropTypes;

AddAttachment.propTypes = {
  callback: func.isRequired,
};
