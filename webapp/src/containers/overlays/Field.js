import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import * as fields from '../../components/fields'

class Field extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  render() {
    const { options, delegate, data, settings, field } = this.props;
    console.log('options1', options);
    const Field = fields[field.get('type')];
    if(!Field){
      return <div>Field not found...</div>
    }
    return (
      <div className="field-overlay">
        <Field
          delegate={delegate}
          options={options.toJS()}
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
