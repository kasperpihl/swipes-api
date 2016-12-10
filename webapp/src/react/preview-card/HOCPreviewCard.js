import React, { Component, PropTypes } from 'react';
import { list } from 'react-immutable-proptypes';
import { setupDelegate } from 'classes/utils';
import * as Fields from './preview-fields';
import PreviewField from './PreviewField';

import './styles/preview-card';

class HOCSwipesCard extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate, this);
    this.bindCallbacks = {};
  }
  componentDidMount() {
  }
  onAction(i, data) {
    this.callDelegate('previewFieldAction', i, data);
  }
  renderFields() {
    const {
      fields,
    } = this.props;

    if (!fields) {
      return undefined;
    }

    return fields.map((f, i) => {
      const Field = Fields[f.get('type')];
      if (!Field) {
        return undefined;
      }
      if (!this.bindCallbacks[i]) {
        this.bindCallbacks[i] = this.onAction.bind(this, i);
      }
      return (
        <PreviewField key={i} title={f.get('title')}>
          <Field data={f.get('data')} onAction={this.bindCallbacks[i]} />
        </PreviewField>
      );
    });
  }
  render() {
    return (
      <div className="preview-card">
        {this.renderFields()}
      </div>
    );
  }
}

export default HOCSwipesCard;

const { string, object } = PropTypes;

HOCSwipesCard.propTypes = {
  fields: list,
  delegate: object,
};
