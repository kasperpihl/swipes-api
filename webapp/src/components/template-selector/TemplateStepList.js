import React, { Component, PropTypes } from 'react'
import TemplateStepListItem from './TemplateStepListItem'

import './styles/template-steplist.scss'

class TemplateStepList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    const { data } = this.props;
    let rootClass = 'template__step-list';

    const listItems = data.map( (item, i) => {
      return <TemplateStepListItem title={item.title} type={item.type} index={i} key={i} />
    })

    return (
      <div className={rootClass} ref="stepList">
        {listItems}
      </div>
    )
  }
}

export default TemplateStepList

const { string } = PropTypes;

TemplateStepList.propTypes = {
}
