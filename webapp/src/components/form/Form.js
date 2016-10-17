import React, { Component, PropTypes } from 'react'
import './styles/form.scss'
import * as Comps from './'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderFields(fields){
    if(fields){
      return fields.map((field, i) => {
        const { type, options, style } = field;
        const Comp = Comps[type];
        if(!Comp){
          return <div key={'unsupported' + i}>Unsupported Component</div>;
        }
        return <Comp key={type + i} options={options} style={style} />
      })
    }
  }
  render() {
    const { children, fields } = this.props;
    console.log('this', this.props.children)
    const renderedChildren = children || this.renderFields(fields);
    return (
      <div className="sw-form">
        {renderedChildren}
      </div>
    )
  }
}
export default Form

const { arrayOf, shape, string, object } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Form.propTypes = {
  fields: arrayOf(shape({
    type: string,
    options: object,
    style: object
  }))
  //removeThis: string.isRequired
}
