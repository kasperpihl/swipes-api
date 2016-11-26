import React, { Component, PropTypes } from 'react'
import { fromJS } from 'immutable'
import { bindAll } from '../../classes/utils'

import ReactTextarea from 'react-textarea-autosize'
import * as Icons from '../icons'

import './styles/textarea.scss'

class Textarea extends Component {
  static icon(){
    return 'DotIcon'
  }
  constructor(props) {
    super(props)
    this.state = {
      focused: false
    }
    bindAll(this, ['handleFocus', 'handleBlur', 'onChange']);
  }
  onChange(e){
    const { data, delegate } = this.props;

    delegate('change', data.set('text', e.target.value));
  }
  handleFocus() {
    this.setState({focused: true})
  }
  handleBlur() {
    this.setState({focused: false})
  }
  renderTextarea() {
    const { data, settings } = this.props;
    const defaultValue = data.get('text') || null;

    return <ReactTextarea
      className="sw-textarea__input"
      defaultValue={defaultValue}
      minRows={1}
      maxRows={10}
      ref='textarea'
      onFocus={this.handleFocus}
      onBlur={this.handleBlur}
      onChange={this.onChange}
      disabled={!settings.get('editable')}
    />
  }
  renderPlaceholder() {
    const { settings, data } = this.props;
    const { focused } = this.state;
    const { textarea } = this.refs;
    let className = 'sw-textarea__placeholder';
    let placeholder = settings.get('placeholder') || 'Default placeholder';

    if (focused || data.get('text').length) {
      className += ' sw-textarea__placeholder--shown'
    }

    return (
      <span className={className}>{placeholder}</span>
    )
  }
  render() {
    return (
      <div className="sw-textarea">
        {this.renderTextarea()}
        {this.renderPlaceholder()}
      </div>
    )
  }
}

export default Textarea

const { string, shape } = PropTypes;

Textarea.propTypes = {
  data: shape({
    text: string
  })
}
