import React, { Component, PropTypes } from 'react';
import { setupCachedCallback } from 'classes/utils';
import Icon from 'Icon';
import './styles/add-attachment';

class AddAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        { title: 'Link', svg: 'Hyperlink' },
        { title: 'Note', svg: 'CreateNote' },
        { title: 'Find', svg: 'Find' },
      ],
    };
    this.onMenuCached = setupCachedCallback(this.onMenu, this);
  }
  onMenu(i) {
    const { callback, hide } = this.props;
    hide();
    switch (i) {
      case 0: return callback('url');
      case 1: return callback('note');
      default: return callback('find');
    }
  }
  renderButtons() {
    const { buttons } = this.state;
    return buttons.map((b, i) => (
      <div key={`button-${i}`} className="add-attachment__item" onClick={this.onMenuCached(i)}>
        <Icon icon={b.svg} className="add-attachment__icon" />
        {b.title}
      </div>
    ));
  }
  render() {
    return (
      <div className="add-attachment">
        {this.renderButtons()}
      </div>
    );
  }
}

export default AddAttachment;

const { func } = PropTypes;

AddAttachment.propTypes = {
  callback: func.isRequired,
  hide: func,
};
