import React, { Component, PropTypes } from 'react'
import Textarea from 'react-textarea-autosize'
import Loader from '../swipes-ui/Loader'

import './styles/swipes-modal.scss'

class SwipesModalActions extends React.Component {
  constructor(props) {
    super(props)
    this.buttonClick = this.buttonClick.bind(this);
    this.state = {}
  }
  buttonClick(e) {
    const i = e.target.getAttribute('data-index');
    this.props.onClick({
      button: parseInt(i, 10)
    })
  }
  render() {
		const { actions } = this.props;
		const buttons = actions.map( (button, i) => {
			return (
				<div className="swipes-modal__actions__button" data-index={i} ref="modalButton" key={i} onClick={this.buttonClick}>{button}</div>
			)
		})

    return (
      <div className="swipes-modal__actions">
				{buttons}
      </div>
    )
  }
}

class SwipesModal extends Component {
  constructor(props) {
    super(props)
    this.closeModal = this.closeModal.bind(this);
    
    this.state = {
      selectedListItems: []
    }
  }
  componentDidUpdate(prevProps){
    if(prevProps.shown !== this.props.shown && this.props.shown){
      this.shownTime = new Date().getTime();
    }
  }
  sendCallback(obj){
    let res = obj;
    if(obj){
      const { list, textarea } = this.props.data;

      const generated = {}
      if(list && list.selectable){
        generated.items = this.state.selectedListItems;
      }
      if(textarea){
        generated.text = this.refs.textarea.value;
      }

      res = Object.assign({}, generated, obj);
    }
    this.setState({selectedListItems: []});
    this.props.callback(res)
  }
  closeModal(e) {
    const now = new Date().getTime();
    const clickDiff = (now - this.shownTime);
    if(clickDiff > 250){
      this.sendCallback(null);
    }
  }
  selectListItem(i) {
    const { list } = this.props.data;

    if (list.selectable) {
      if(this.state.selectedListItems.includes(i)){
        this.setState({selectedListItems: this.state.selectedListItems.filter((j) => j !== i )})
      }
      else{
        this.setState({selectedListItems: this.state.selectedListItems.concat(i)})
      }
    } else {
      this.sendCallback({
        item: i
      })
    }
  }
  renderMessage(message, key) {
		if (message && message.length > 0) {
			return (
				<div key={key} className="swipes-modal__message">{message}</div>
			)
		}
	}
  renderTextarea(options, key) {
    var defaultValue = "";
    var placeholder = options;
    var minRows = 4;
    var maxRows = 4;
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
          maxRows={maxRows}/>
      )
    }
  }
  renderLoader(loader, key) {
    if (loader) {
      return (
        <div className="swipes-modal__loader" key={key}>
          <Loader center={true} text="Loading" />
        </div>
      )
    }
  }
	renderList(list, key) {
    if(!list || typeof list !== 'object'){
      return;
    }

    let items = list;

    if (!Array.isArray(list)) {
      items = list.items;
    }

    if (items) {
  		const listRender = items.map( (item, i) => {
        let className = "swipes-modal__list__item";

        if (item.selected || this.state.selectedListItems.includes(i)){
          className += ' swipes-modal__list__item--selected'
        }
  			return (
  				<div className={className} key={i} onClick={this.selectListItem.bind(this, i)}>
  					{this.renderListItemImg(item.img)}
  					<div className="swipes-modal__list__item__title">
  						{item.title}
  					</div>
  				</div>
  			)
  		})

  		return (
  			<div className="swipes-modal__list" key={key}>{listRender}</div>
  		)
    }
	}
	renderListItemImg(img) {
		if (img && typeof img === 'string') {
			return (
				<img className="swipes-modal__list__item__img" src={img} />
			)
		} else if (img && typeof img === 'object') {
      const SVG = img.element;
      const props = img.props || {};
      return (
        <SVG className="swipes-modal__list__item__img" {...props} />
      )
    }
	}
	renderButtons(buttons, key) {
		if (buttons && buttons.length > 0) {
			return (
				<SwipesModalActions key={key} actions={buttons} onClick={this.sendCallback.bind(this)}/>
			)
		}
	}
  renderContent(data){
    if(!data){
      return;
    }
    const { message, textarea, buttons, list, loader } = data;
    if(Array.isArray(data)){
      return data.map((item, i) => {
        switch(item.type){
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
        }
      })
    }
    else if(typeof data === 'object'){
      return [
        this.renderMessage(message, 1),
        this.renderTextarea(textarea, 2),
        this.renderLoader(loader, 3),
        this.renderList(list, 4),
        this.renderButtons(buttons, 5)
      ]
    }
  }
  render() {
    const { title, type,  data, shown, callback } = this.props;
    let modalWrapClass = "swipes-modal__holder"

    if(shown){
      modalWrapClass += ' swipes-modal__holder--shown'
    }
    let modalClass = 'swipes-modal';

    if (type) {
      modalClass += ' swipes-modal--' + type.toLowerCase();
    }

    return (
      <div className={modalWrapClass}>
        <div className="swipes-modal__overlay" onClick={this.closeModal}></div>
        <div className={modalClass}>
          <div className="swipes-modal__title">
            {title}
            <i className="material-icons swipes-modal__close" onClick={this.closeModal}>close</i>
          </div>
          {this.renderContent(data)}
        </div>
      </div>
    )
  }
}

export default SwipesModal
const { any, bool, oneOf, string, shape, element, oneOfType, object, number, arrayOf, func, node } = PropTypes;
const itemProps = shape({
  title: string,
  selected: bool,
  img: oneOfType([
    string,
    node,
    object
  ])
})

SwipesModal.propTypes = {
  callback: func.isRequired,
  shown: bool,
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
          maxRows: number
        })
      ]),
      loader: oneOfType([
        bool,
        string
      ]),
      list: oneOfType([
        arrayOf(itemProps),
        shape({
          items: arrayOf(itemProps).isRequired,
          selectable: bool,
        })
      ]),
      buttons: arrayOf(oneOfType([
        string,
        shape({
          title: string,
          bgColor: string,
          textColor: string
        })
      ]))

    }),
    arrayOf(shape({
      type: oneOf(['message', 'textarea', 'loader', 'list', 'buttons']),
      value: any
    }))
  ])
}
