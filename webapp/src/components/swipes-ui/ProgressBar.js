import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils'

class ProgressBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: props.index || 0
    }
    bindAll(this, ['onChange']);
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  componentDidMount() {
  }
  onChange(i){
    const { activeIndex } = this.state;
    if(activeIndex !== i){
      this.setState({activeIndex: i});
      this.callDelegate('barDidChange', i);
    }
  }
  renderSteps(){
    // onClick = this.onChange
  }
  render() {
    return (
      <div className="sw-progress-bar"></div>
    )
  }
}

export default ProgressBar

const { arrayOf, bool, shape, string } = PropTypes;

ProgressBar.propTypes = {
  steps: arrayOf(shape({
    title: string,
    completed: bool
  }))
}
