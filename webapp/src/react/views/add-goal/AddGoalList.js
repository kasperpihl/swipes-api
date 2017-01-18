import React, { Component, PropTypes } from 'react';
import { setupCachedCallback, setupDelegate } from 'classes/utils';
import { List, Map } from 'immutable';

import './styles/add-goal-list';

// now use events as onClick: this.onChangeCached(i)
class AddGoalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: List(),
      addText: '',
    };
    this.callDelegate = setupDelegate(props.delegate);
    this.onChangeCached = setupCachedCallback(this.onChange, this);
  }
  componentDidMount() {
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.fields.size !== prevState.fields.size) {
      this.callDelegate('onUpdatedFieldSize', this.state.fields.size);
    }
  }
  onChange(i, e) {
    let { fields } = this.state;
    const newText = e.target.value;
    if (i === fields.size) {
      fields = fields.push(Map({
        text: newText,
      }));
    } else {
      fields = fields.setIn([i, 'text'], newText);
    }
    this.setState({ fields });
  }
  renderField(i, text) {
    const { fields } = this.state;
    const isLast = fields.size === i;
    let className = 'step';

    if (isLast) {
      className += ' step--last';
    }

    return (
      <div key={i} className={className}>
        <div className="step__header">
          <input
            className="step__title"
            placeholder={'Add Step'}
            value={text}
            onChange={this.onChangeCached(i)}
          />
        </div>
      </div>
    );
  }
  renderFields() {
    const { fields, addText } = this.state;
    let renderedFields = fields.map((f, i) => this.renderField(i, f.get('text')));
    const lField = fields.size ? fields[fields.size - 1] : null;

    if (!lField || !lField.get('text') || !lField.get('text').length) {
      renderedFields = renderedFields.concat([this.renderField(fields.size, addText)]);
    }

    return renderedFields;
  }
  render() {
    return (
      <div className="add-goal__list">
        {this.renderFields()}
      </div>
    );
  }
}

export default AddGoalList;

const { string } = PropTypes;

AddGoalList.propTypes = {

};
