import React, { Component, PropTypes } from 'react';
import { setupDelegate, setupCachedCallback } from 'classes/utils';
import Button from 'Button';
import Icon from 'Icon';
import './styles/attachment-menu';

class AttachmentMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addMenu: false,
      buttons: [
        { title: 'Link', svg: 'LinkIcon' },
        { title: 'Note', svg: 'ListIcon' },
      ],
    };
    this.onMenuCached = setupCachedCallback(this.onMenu, this);
    this.onAdd = this.onAdd.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  onMenu(i) {
    console.log(i);

    if (i === 0) {
      this.setState({ addMenu: 'link' });
    }
    if (i === 1) {
      this.setState({ addMenu: 'note' });
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
    return (
      <div className="attachment-menu__attach">
        <input className="attachment-menu__input" placeholder="Enter a URL" key="input" type="text" ref={(c) => { this._input = c; }} />,
        <Button primary key="butt" text="Add" onClick={this.onAdd} className="attachment-menu__button" />,
      </div>
    );
  }
  renderButtons() {
    const { addMenu, buttons } = this.state;
    if (addMenu) {
      return undefined;
    }
    return buttons.map((b, i) => (
      <div key={`button-${i}`} className="attachment-menu__item" onClick={this.onMenuCached(i)}>
        <Icon svg={b.svg} className="attachment-menu__icon" />
        {b.title}
      </div>
    ));
  }
  render() {
    return (
      <div className="attachment-menu">
        {this.renderAddMenu()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default AttachmentMenu;

const { string } = PropTypes;

AttachmentMenu.propTypes = {

};
