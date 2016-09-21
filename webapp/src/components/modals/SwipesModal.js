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
  renderTextarea(placeholder) {
    if (placeholder && placeholder.length > 0) {
      return (
        <Textarea
          ref="message"
          className="swipes-modal__textarea"
          onChange={this.onMessageChange}
          placeholder={placeholder}
          minRows={4}
          maxRows={4}/>
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
      return <Loader center={true} text="Loading" />
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
      modalClass += ' shown'
    }

    return (
      <div className={modalClass}>
        {this.renderContent(data)}
      </div>
    )
  }
}

export default SwipesModal

SwipesModal.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string,
    textarea: PropTypes.string,
    loader: PropTypes.bool,
    items: PropTypes.shape({
      title: PropTypes.string,
      imgUrl: PropTypes.string
    }),
    buttons: PropTypes.array,
    type: PropTypes.string
  }.isRequired)
}
