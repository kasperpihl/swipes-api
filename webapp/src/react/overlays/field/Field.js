import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import * as fields from 'src/react/swipes-fields';

class Field extends Component {
  constructor(props) {
    super(props);
    let data = Map(props.data);

    const FieldHtml = fields[props.field.get('type')];
    if (typeof FieldHtml.parseInitialData === 'function') {
      data = FieldHtml.parseInitialData(data);
    }

    this.state = { data };
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

const { func } = PropTypes;

Field.propTypes = {
  data: map,
  settings: map,
  field: map,
  delegate: func,
};

const ConnectedField = connect(mapStateToProps, null)(Field);
export default ConnectedField;
