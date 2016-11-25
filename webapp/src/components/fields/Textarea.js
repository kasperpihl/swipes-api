import React, { Component, PropTypes } from 'react'
import { fromJS } from 'immutable'

import ReactTextarea from 'react-textarea-autosize'
import * as Icons from '../icons'

import './styles/textarea.scss'

class Textarea extends Component {
  static icon(){
    return 'DotIcon'
  }
  constructor(props) {
    super(props)
    this.bindCallbacks = {};
  }
  onChange(i, text){
    const { data, delegate } = this.props;

    delegate('change', data.set('text', text));
  }
  renderTextarea() {
    const { data } = this.props;
    const defaultValue = data.get('text') || null;

    return <ReactTextarea
      className="field-textarea"
      defaultValue={defaultValue}
      minRows={1}
      maxRows={10}
    />
  }
  renderPlaceholder() {
    const { settings } = this.props;

  }
  render() {
    return (
      <div className="checklist">
        {this.renderTextarea()}
        {this.renderPlaceholder()}
      </div>
    )
  }
}

export default Textarea

const { string, bool, arrayOf, shape } = PropTypes;

Textarea.propTypes = {
  data: shape({
    checks: arrayOf(shape({
      label: string,
      checked: bool
    }))
  })
}
