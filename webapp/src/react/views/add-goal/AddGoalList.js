import React, { Component, PropTypes } from 'react';
import { setupCachedCallback } from 'classes/utils';
import './styles/add-goal-list';
import { List, Map } from 'immutable';

// now use events as onClick: this.onChangeCached(i)
class AddGoalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: List(),
      addText: '',
    };
    this.onChangeCached = setupCachedCallback(this.onChange, this);
  }
  componentDidMount() {
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
    console.log(i, e.target.value);
  }
  renderField(i, text) {
    const { fields } = this.state;
    const isLast = fields.size === i;
    let className = 'add-goal-list__step';

    if (isLast) {
      className += ' add-goal-list__step--last';
    }

    return (
      <div className={className}>
        <div className="add-goal-list__header">
          <input
            key={i}
            className="add-goal-list__title"
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
      <div className="add-goal-list">
        {this.renderFields()}
      </div>
    );
  }
}

export default AddGoalList;

const { string } = PropTypes;

AddGoalList.propTypes = {

};
