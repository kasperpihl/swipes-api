import React, { Component, PropTypes } from 'react';
import Textarea from 'react-textarea-autosize';
import Loader from '../swipes-ui/Loader';
import Icon from '../icons/Icon';

import './styles/swipes-modal.scss';

class SwipesModal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    const selectedItems = [];
    const { list } = this.props.data;
    if (list && list.items) {
      list.items.forEach((o, i) => {
        if (o.selected) {
          selectedItems.push(i);
        }
      });
    }
    this.state = {
      selectedListItems: selectedItems,
    };
    this.buttonClick = this.buttonClick.bind(this);
    this.selectListItem = this.selectListItem.bind(this);
  }
  componentDidMount() {
    if (this.refs.textarea) {
      this.refs.textarea.focus();
    }
  }
  sendCallback(obj) {
    let res = obj;
    if (obj) {
      const { list, textarea } = this.props.data;

      const generated = {};
      if (list && list.selectable) {
        generated.items = this.state.selectedListItems;
      }
      if (textarea) {
        generated.text = this.refs.textarea.value;
      }

      res = Object.assign({}, generated, obj);
    }
    this.setState({ selectedListItems: [] });
    this.props.callback(res);
  }
  closeModal() {
    this.sendCallback(null);
  }
  buttonClick(e) {
    const i = e.target.getAttribute('data-index');

    this.sendCallback({
      button: parseInt(i, 10),
    });
  }
  selectListItem(e) {
    const i = e.target.getAttribute('data-index');
    const { list } = this.props.data;

    if (list.selectable) {
      if (!list.multiple) {
        this.setState({ selectedListItems: [i] });
      } else if (this.state.selectedListItems.includes(i)) {
        this.setState({ selectedListItems: this.state.selectedListItems.filter(j => j !== i) });
      } else {
        this.setState({ selectedListItems: this.state.selectedListItems.concat(i) });
      }
    } else {
      this.sendCallback({
        item: i,
      });
    }
  }
  renderMessage(message, key) {
    if (message && message.length > 0) {
      return (
        <div key={key} className="swipes-modal__message">{message}</div>
      );
    }

    return undefined;
  }
  renderTextarea(options, key) {
    let defaultValue = '';
    let placeholder = options;
    let minRows = 4;
    let maxRows = 4;

    if (typeof options === 'object') {
      defaultValue = options.text || defaultValue;
      placeholder = options.placeholder || 'Edit text';
      minRows = options.minRows || minRows;
      maxRows = options.maxRows || maxRows;
    }

    if (placeholder && placeholder.length > 0) {
      return (
        <Textarea
          key={key}
          ref="textarea"
          className="swipes-modal__textarea"
          onChange={this.onMessageChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
          minRows={minRows}
          maxRows={maxRows}
        />
      );
    }

    return undefined;
  }
  renderLoader(loader, key) {
    if (loader) {
      return (
        <div className="swipes-modal__loader" key={key}>
          <Loader center text="Loading" />
        </div>
      );
    }

    return undefined;
  }
  renderList(list, key) {
    if (!list || typeof list !== 'object') {
      return undefined;
    }

    let items = list;

    if (!Array.isArray(list)) {
      items = list.items;
    }

    if (!items) {
      return undefined;
    }

    const listRender = items.map((item, i) => {
      let className = 'swipes-modal__list__item';

      if (this.state.selectedListItems.includes(i)) {
        className += ' swipes-modal__list__item--selected';
      }

      return (
        <div className={className} key={i} data-index={i} onClick={this.selectListItem}>
          {this.renderIcon(item.img)}
          <div className="swipes-modal__list__item__title" data-index={i}>
            {item.title}
          </div>
        </div>
      );
    });

    return (
      <div className="swipes-modal__list" key={key}>{listRender}</div>
    );
  }
  renderIcon(icon) {
    if (!icon) return undefined;

    const svg = icon.element;
    const props = icon.props || {};

    if (<Icon svg={svg} /> && svg) {
      return <Icon svg={svg} className="swipes-modal__list__item__img" {...props} />;
    }

    return (
      <img
        className="swipes-modal__list__item__img"
        src={icon}
        role="presentation"
      />
    );
  }
  renderButtons(buttons, key) {
    if (buttons && buttons.length > 0) {
      return (
        <SwipesModalActions
          key={key}
          actions={buttons}
          onClick={this.buttonClick}
        />
      );
    }

    return undefined;
  }
  renderContent(data) {
    if (!data) {
      return undefined;
    }

    const { message, textarea, buttons, list, loader } = data;

    if (Array.isArray(data)) {
      return data.map((item, i) => {
        switch (item.type) {
          case 'message':
            return this.renderMessage(item.value, i);
          case 'textarea':
            return this.renderTextarea(item.value, i);
          case 'loader':
            return this.renderLoader(item.value, i);
          case 'list':
            return this.renderList(item.value, i);
          case 'buttons':
            return this.renderButtons(item.value, i);
          default:
            return undefined;
        }
      });
    } else if (typeof data === 'object') {
      return [
        this.renderMessage(message, 1),
        this.renderLoader(loader, 2),
        this.renderList(list, 3),
        this.renderTextarea(textarea, 4),
        this.renderButtons(buttons, 5),
      ];
    }

    return undefined;
  }
  render() {
    const { title, type, data } = this.props;

    let modalClass = 'swipes-modal';

    if (type) {
      modalClass += ` swipes-modal--${type.toLowerCase()}`;
    }

    return (
      <div className={modalClass}>
        <div className="swipes-modal__title">
          {title}
          <i className="material-icons swipes-modal__close" onClick={this.closeModal}>close</i>
        </div>
        {this.renderContent(data)}
      </div>
    );
  }
}

const SwipesModalActions = (props) => {
  const { actions } = props;
  const buttons = actions.map((button, i) => (
    <div
      className="swipes-modal__actions__button"
      data-index={i}
      ref="modalButton"
      key={i}
      onClick={props.onClick}
    >
      {button}
    </div>
  ));

  return (
    <div className="swipes-modal__actions">
      {buttons}
    </div>
  );
};

export default SwipesModal;
const {
  any,
  bool,
  oneOf,
  string,
  shape,
  oneOfType,
  object,
  number,
  arrayOf,
  func,
  node,
  array,
} = PropTypes;
const itemProps = shape({
  title: string,
  selected: bool,
  img: oneOfType([
    string,
    node,
    object,
  ]),
});

SwipesModal.propTypes = {
  callback: func.isRequired,
  title: string,
  type: string,
  data: oneOfType([
    shape({
      message: string,
      textarea: oneOfType([
        string, // Placeholder
        shape({
          placeholder: string,
          text: string,
          minRows: number,
          maxRows: number,
        }),
      ]),
      loader: oneOfType([
        bool,
        string,
      ]),
      list: oneOfType([
        arrayOf(itemProps),
        shape({
          items: arrayOf(itemProps).isRequired,
          selectable: bool,
        }),
      ]),
      buttons: arrayOf(oneOfType([
        string,
        shape({
          title: string,
          bgColor: string,
          textColor: string,
        }),
      ])),

    }),
    arrayOf(shape({
      type: oneOf(['message', 'textarea', 'loader', 'list', 'buttons']),
      value: any,
    })),
  ]),
};

SwipesModalActions.propTypes = {
  actions: array,
  onClick: func,
};
