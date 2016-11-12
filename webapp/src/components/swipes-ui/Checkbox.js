import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import './styles/checkbox.scss'

class Checkbox extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    const { checked } = this.props;
    if (checked) {
      this.refs.checkboxInput.checked = true;
    }
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="sw-checkbox__icon" />;
    }
  }
  onChange(e){
    const { onChange } = this.props;
    if(onChange){
      onChange(this.refs.checkboxInput.checked);
    }
  }
  render() {

    const { label } = this.props;
    return (
      <label className="sw-checkbox">
      	<input ref="checkboxInput" onChange={this.onChange} type="checkbox" className="sw-checkbox__input" />
      	<div className="sw-checkbox__indicator">{this.renderIcon('CheckmarkIcon')}</div>
        <div className="sw-checkbox__label">{label}</div>
      </label>
    )
  }
}

export default Checkbox

const { string, bool, func } = PropTypes;

Checkbox.propTypes = {
  onChange: func,
  label: string,
  checked: bool
}
