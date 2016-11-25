import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import * as fields from '../../components/fields'

class Field extends Component {
  constructor(props) {
    super(props)
    this.state = { data: props.data };
    this.delegate = this.delegate.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  delegate(name, data){
    const { delegate, index } = this.props;
    // Do a controlled field
    if(name === 'change'){
      this.setState({data});
    }
    // And forward to the delegate from GoalStep.
    delegate.apply(null, arguments);
  }
  render() {
    const { settings, field } = this.props;
    const { data } = this.state;
    const Field = fields[field.get('type')];
    if(!Field){
      return <div>Field not found...</div>
    }
    return (
      <div className="field-overlay" style={{height: '100%'}}>
        <Field
          delegate={this.delegate}
          data={data}
          settings={settings}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    main: state.get('main')
  }
}

import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
const { string } = PropTypes;
Field.propTypes = {
  //removeThis: PropTypes.string.isRequired
}

const ConnectedField = connect(mapStateToProps, {
  onDoing: actions.doStuff
})(Field)
export default ConnectedField
