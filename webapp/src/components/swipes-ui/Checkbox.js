import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import './styles/checkbox.scss'

class Checkbox extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="sw-checkbox__icon" />;
    }
  }
  render() {
    const { label } = this.props;

    console.log(this.props);

    return (
      <label className="sw-checkbox">
      	{label}
      	<input type="checkbox" className="sw-checkbox__input" />
      	<div className="sw-checkbox__indicator">{this.renderIcon('CheckmarkIcon')}</div>
      </label>
    )
  }
}

export default Checkbox

const { string } = PropTypes;

Checkbox.propTypes = {
  label: string
}
