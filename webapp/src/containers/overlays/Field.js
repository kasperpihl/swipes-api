import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import * as actions from '../../actions';
import * as fields from '../../components/fields';

class Field extends Component {
  constructor(props) {
    super(props);
    this.state = { data: props.data };
    this.delegate = this.delegate.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  delegate(name, data) {
    const { delegate } = this.props;
    // Do a controlled field
    if (name === 'change') {
      this.setState({ data });
    }
    // And forward to the delegate from GoalStep.
    delegate(arguments);
  }
  render() {
    const { settings, field } = this.props;
    const { data } = this.state;
    const FieldHtml = fields[field.get('type')];

    if (!FieldHtml) {
      return <div>Field not found...</div>;
    }

    return (
      <div className="field-overlay" style={{ height: '100%' }}>
        <FieldHtml
          delegate={this.delegate}
          data={data}
          settings={settings}
        />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    main: state.get('main'),
  };
}

const { object } = PropTypes;

Field.propTypes = {
  data: map,
  settings: map,
  field: map,
  delegate: object,
};

const ConnectedField = connect(mapStateToProps, {
  onDoing: actions.doStuff,
})(Field);
export default ConnectedField;
