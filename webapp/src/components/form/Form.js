import React, { Component, PropTypes } from 'react'
import './styles/form.scss'
import * as Comps from './'
import Button from '../swipes-ui/Button'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onSubmit = this.onSubmit.bind(this);
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
        return <Comp ref={'comp'+i} key={'comp' + i} options={options} style={style} />
      })
    }
  }
  onSubmit(){
    const { fields, children, onSubmit } = this.props;
    const values = [];
    if(fields){
      fields.forEach((field, i) => {
        const comp = this.refs['comp' + i];
        let val = null;
        if(comp && typeof comp.getValue === 'function'){
          val = comp.getValue();
        }
        values.push(val);
      })
    }
    if(onSubmit){
      onSubmit(values);
    }
  }

  renderSubmit(){
    const { submit } = this.props;
    if(submit){
    return <Button callback={this.onSubmit} title="READY" style={{boxShadow: "none", marginTop: "108px", marginLeft: "73px"}}/>
    }
  }
  render() {
    const { children, fields } = this.props;
    const renderedChildren = children || this.renderFields(fields);
    return (
      <div className="sw-form">
        {renderedChildren}
        {this.renderSubmit()}
      </div>
    )
  }
}
export default Form

const { func, bool, arrayOf, shape, string, object } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Form.propTypes = {
  onSubmit: func,
  submit: bool,
  fields: arrayOf(shape({
    type: string,
    options: object,
    style: object
  }))
  //removeThis: string.isRequired
}
