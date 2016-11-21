import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import Checkbox from '../swipes-ui/Checkbox'
import './styles/checklist.scss'
import { fromJS } from 'immutable'

class Checklist extends Component {
  static getIcon(){
    return 'CheckmarkIcon'
  }
  constructor(props) {
    super(props)
    this.state = { checks: fromJS(props.data.checks) };
    this.bindCallbacks = {};
  }
  onChange(i, checked){
    const { checks } = this.state;
    const newChecks = checks.setIn([i, 'checked'], checked);
    this.setState({checks: newChecks});

    const { delegate } = this.props;
    delegate('change', {checks: newChecks.toJS()});
  }
  renderChecks(){
    const { checks } = this.state;
    return checks.map((c,i) => {
      if(!this.bindCallbacks[i]){
        this.bindCallbacks[i] = this.onChange.bind(this, i);
      }
      return (
        <Checkbox key={i} onChange={this.bindCallbacks[i]} label={c.get('label')} checked={c.get('checked')} />
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
