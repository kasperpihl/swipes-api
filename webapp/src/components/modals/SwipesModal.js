import React, { Component, PropTypes } from 'react'
import Textarea from 'react-textarea-autosize'
import Loader from '../swipes-ui/Loader'

import './styles/swipes-modal.scss'

class SwipesModalActions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  buttonClick(e) {
    const { modalButton } = this.refs;
  }
  render() {
		const { actions } = this.props;
		const buttons = actions.map( (button, i) => {
			return (
				<div className="swipes-modal__actions__button" ref="modalButton" key={i} onClick={this.buttonClick.bind(this, i)}>{button}</div>
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
    this.state = {}
  }
  sendCallback(){
    /*
    {
      button: 0 || 1
      text: this.refs.textarea.value,
      item: 0 || 1
    }
    if you click the background, callback(null)
    this.props.callback()
    */
  }
  renderMessage(message) {
		if (message && message.length > 0) {
			return (
				<div className="swipes-modal__message">{message}</div>
			)
		}
	}
  renderTextarea(options) {
    var defaultValue = "";
    var placeholder = options;
    var minRows = 4;
    var maxRows = 4;
    if(typeof options === 'object'){
      defaultValue = options.text || defaultValue;
      placeholder = options.placeholder || 'Edit text';
      minRows = options.minRows || minRows;
      maxRows = options.maxRows || maxRows;
    }
    if (placeholder && placeholder.length > 0) {
      return (
        <Textarea
          ref="message"
          className="swipes-modal__textarea"
          onChange={this.onMessageChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
          minRows={minRows}
          maxRows={maxRows}/>
      )
    }
  }
	renderList(items) {
    if (items) {
  		const list = items.map( (item, i) => {
  			return (
  				<div className="swipes-modal__list__item" key={i}>
  					{this.renderListItemImg(item.imgUrl)}
  					<div className="swipes-modal__list__item__title">
  						{item.title}
  					</div>
  				</div>
  			)
  		})

  		return (
  			<div className="swipes-modal__list">{list}</div>
  		)
    }
	}
  renderLoader(loader){
    if(loader){
      return (
        <div className="swipes-modal__loader">
          <Loader center={true} text="Loading" />
        </div>
      )
    }
  }
	renderListItemImg(img) {
		if (img) {
			return (
				<img className="swipes-modal__list__item__img" src={img} />
			)
		}
	}
	renderActions(actions) {
		if (actions && actions.length > 0) {
			return (
				<SwipesModalActions actions={actions} />
			)
		}
	}
  renderContent(data){
    if(!data){
      return;
    }
    const { title, message, textarea, buttons, items, type, loader } = data;

    let modalClass = 'swipes-modal';

    if (type) {
      modalClass += ' swipes-modal--' + type.toLowerCase();
    }

    return (
      <div className={modalClass}>
        <div className="swipes-modal__title">
          {title}
          <i className="material-icons swipes-modal__close">close</i>
        </div>
        {this.renderMessage(message)}
        {this.renderTextarea(textarea)}
        {this.renderLoader(loader)}
        {this.renderList(items)}
        {this.renderActions(buttons)}
      </div>
    )
  }
  render() {
    const { data, shown, callback } = this.props;

    let modalClass = "swipes-modal-overlay"
    if(shown){
      modalClass += ' swipes-modal-overlay--shown'
    }

    return (
      <div className={modalClass}>
        {this.renderContent(data)}
      </div>
    )
  }
}


export default SwipesModal

const itemProps = PropTypes.shape({
  title: PropTypes.string,
  image: PropTypes.string
})
SwipesModal.propTypes = {
  callback: PropTypes.func,
  show: PropTypes.bool,
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string,
    textarea: PropTypes.oneOfType([
      PropTypes.string, // Placeholder
      PropTypes.shape({
        placeholder: PropTypes.string,
        text: PropTypes.string,
        minRows: PropTypes.number,
        maxRows: PropTypes.number
      })
    ]),
    loader: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ]),
    list: PropTypes.oneOfType([
      PropTypes.arrayOf(itemProps),
      PropTypes.shape({
        items: PropTypes.arrayOf(itemProps).isRequired,
        selectable: PropTypes.bool,
      })
    ]),
    buttons: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string,
        bgColor: PropTypes.string,
        textColor: PropTypes.string
      })
    ])),
    type: PropTypes.string
  }.isRequired)
}
