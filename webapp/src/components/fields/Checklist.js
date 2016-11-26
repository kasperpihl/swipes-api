import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import Checkbox from '../swipes-ui/Checkbox'
import './styles/checklist.scss'
import { fromJS } from 'immutable'

class Checklist extends Component {
  constructor(props) {
    super(props)
    this.bindCallbacks = {};
  }
  onChange(i, checked){
    const { data, delegate } = this.props;
    delegate('change', data.setIn(['checks', i, 'checked'], checked));
  }
  renderChecks(){
    const { data, settings } = this.props;

    return data.get('checks').map((c,i) => {
      if(!this.bindCallbacks[i]){
        this.bindCallbacks[i] = this.onChange.bind(this, i);
      }
      return (
        <Checkbox key={i} onChange={this.bindCallbacks[i]} label={c.get('label')} checked={c.get('checked')} disable={settings.get('editable')}/>
      )
    })
  }
  render() {
    return (
      <div className="checklist">
        {this.renderChecks()}
      </div>
    )
  }
}

export default Checklist

const { string, bool, arrayOf, shape } = PropTypes;

Checklist.propTypes = {
  data: shape({
    checks: arrayOf(shape({
      label: string,
      checked: bool
    }))
  })
}
