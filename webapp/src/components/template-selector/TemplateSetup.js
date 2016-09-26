import React, { Component, PropTypes } from 'react'
import TemplateHeader from './TemplateHeader'
import TemplateStepList from './TemplateStepList'
import { bindAll, debounce } from '../../classes/utils'

import './styles/template-setup.scss'

class TemplateSetup extends Component {
  constructor(props) {
    super(props)
    this.state = { listHeight: 0 }
    bindAll(this, ['calculateListHeight'])
    this.bouncedCalc = debounce(this.calculateListHeight, 10);
  }
  componentDidMount() {
    window.addEventListener('resize', this.bouncedCalc);
    this.calculateListHeight();
  }
  componentDidUpdate(){
    this.calculateListHeight();
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this.bouncedCalc);
  }
  calculateListHeight(){
    const currentHeight = this.state.listHeight;
    const containerHeight = this.refs.container.clientHeight;
    const headerHeight = this.refs.header.clientHeight;

    const listHeight = containerHeight - headerHeight;
    if(listHeight !== currentHeight){
      this.setState({ listHeight });
    }
  }
  render() {
    let rootClass = 'template__setup';

    return (
      <div ref="container" className={rootClass}>
        <div ref="header">
          <TemplateHeader data={this.props.data} />
        </div>
        <TemplateStepList data={this.props.data.steps} height={this.state.listHeight + 'px'}/>
      </div>
    )
  }
}

export default TemplateSetup

const { string } = PropTypes;

TemplateSetup.propTypes = {

}
