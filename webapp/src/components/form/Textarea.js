import React, { Component, PropTypes } from 'react'
import ReactTextarea from 'react-textarea-autosize'

import './styles/textarea.scss'

class Textarea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue || ''
    }
    this.setValue = this.setValue.bind(this);
  }
  componentDidMount() {
  }
  getValue(){
    return this.state.value;
  }
  setValue(e) {
    this.setState({value: e.target.value})
  }
  render() {
    const options = this.props.options || {};
    const style = this.props.style || {};

    return (
      <div className="sw-textarea">
        <ReactTextarea className="sw-textarea__input" {...options} style={style} value={this.state.value} onChange={this.setValue}/>
      </div>
    )
  }
}

export default Textarea

const { string, number, object, shape } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

Textarea.propTypes = {
  options: shape({
    minRows: number,
    maxRows: number,
    placeholder: string,
    defaultValue: string
  }),
  styles: object
}
