import React, { Component, PropTypes } from 'react'
import './styles/form.scss'
import * as Comps from './'
import * as Icons from '../icons'
import Button from '../swipes-ui/Button'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
  }
  renderIcon(icon, i){
    const Comp = Icons[icon];
    if(Comp){
      return <Comp className="sw-form__icon sw-form__icon--svg"/>;
    }
    return <i className="material-icons sw-form__icon sw-form__icon--font">{icon}</i>
  }
  renderHeader(header, i){
    const { title, description, icon } = header;
    return (
      <div key={'header'+i} className="sw-form__header">
        {this.renderIcon(icon)}
        <div className="sw-form__title">{title}</div>
        <div className="sw-form__description">{description}</div>
      </div>
    )
  }
  renderFields(fields){
    if(fields){
      const renderedArr = [];
      fields.forEach((field, i) => {
        const { type, options, style, header } = field;
        const Comp = Comps[type];
        if(header && header.title){
          renderedArr.push(this.renderHeader(header, i));
        }
        if(!Comp){
          renderedArr.push(<div key={'unsupported' + i}>Unsupported Component</div>);
        }
        else {
          renderedArr.push(<Comp ref={'comp'+i} key={'comp' + i} options={options} style={style} />)
        }
      })
      return renderedArr
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
    return <Button callback={this.onSubmit} title="READY" style={{boxShadow: "none", marginTop: "108px"}}/>
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
