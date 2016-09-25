import React, { Component, PropTypes } from 'react'
import TemplateListItem from './TemplateListItem'
import './styles/template-list.scss'

class TemplateList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {}
  render() {
    const { data } = this.props;
    let templates;

    if (data) {
      templates = data.map( (template, i) => {
        return (
          <TemplateListItem data={template} key={i} />
        )
      })
    }

    return (
      <div className="template__list">
        {templates}
      </div>
    )
  }
}

export default TemplateList

const { shape, arrayOf } = PropTypes
TemplateList.propTypes = {
  data: arrayOf(shape(TemplateListItem.propTypes))
}
