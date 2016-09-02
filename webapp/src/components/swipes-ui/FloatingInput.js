import React, { Component, PropTypes } from 'react'
import './floating-input.scss'

class FloatingInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      float: false,
      floatValue: 0,
      value: null
    }
  }
  componentDidMount() {
  }
  floatFocus() {
    if (!this.state.float) {
      this.setState({float: !this.state.float})
    }
  }
  floatBlur() {
    const input = this.refs.floatingInput;
    const inputVal = input.value.length;

    if (this.state.float) {
      this.setState({float: !this.state.float})
    }

    this.setState({floatValue: inputVal});
  }
  onChange(e) {
    this.setState({value: e.target.value});
  }
  render() {
    const { label, errorMessage, type, id } = this.props;
    let floatingClass = 'floating-label--inactive';

    if (this.state.float) {
      floatingClass = 'floating-label--active'
    }

    if (this.state.floatValue > 0) {
      floatingClass += ' floating-label--standby'
    }

    return (
      <div className={"floating-label " + floatingClass}>
      	<input ref="floatingInput" className="floating-label__input" type={type} id={id} onFocus={this.floatFocus.bind(this)} onBlur={this.floatBlur.bind(this)} onChange={this.onChange.bind(this)}/>
      	<label htmlFor={id} className="floating-label__label">{label}</label>
      </div>
    )
  }
}

export default FloatingInput

FloatingInput.propTypes = {
  // removeThis: PropTypes.string.isRequired
}
