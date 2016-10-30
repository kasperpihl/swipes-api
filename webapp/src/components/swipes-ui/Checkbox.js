import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import './styles/checkbox.scss'

class Checkbox extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    const { checkboxInput } = this.refs;
    const { checked } = this.props;

    if (checked) {
      checkboxInput.checked = true;
    }
  }
  handleClick() {

  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="sw-checkbox__icon" />;
    }
  }
  render() {
    const { label } = this.props;

    return (
      <label className="sw-checkbox">
      	{label}
      	<input ref="checkboxInput" type="checkbox" className="sw-checkbox__input" />
      	<div className="sw-checkbox__indicator">{this.renderIcon('CheckmarkIcon')}</div>
      </label>
    )
  }
}

export default Checkbox

const { string, bool } = PropTypes;

Checkbox.propTypes = {
  label: string,
  checked: bool
}
