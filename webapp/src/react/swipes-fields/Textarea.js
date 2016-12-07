import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import ReactTextarea from 'react-textarea-autosize';

import { bindAll } from 'classes/utils';

import './styles/textarea.scss';

class Textarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    bindAll(this, ['onChange']);
  }
  onChange(e) {
    const { data, delegate } = this.props;

    delegate('change', data.set('text', e.target.value));
  }
  renderTextarea() {
    const { data, settings } = this.props;
    const defaultValue = data.get('text') || null;
    const placeholder = settings.get('placeholder') || 'Text';

    return (<ReactTextarea
      className="sw-textarea__input"
      defaultValue={defaultValue}
      minRows={3}
      maxRows={10}
      ref="textarea"
      onChange={this.onChange}
      disabled={!settings.get('editable')}
      placeholder={placeholder}
    />);
  }
  render() {
    return (
      <div className="sw-textarea">
        {this.renderTextarea()}
      </div>
    );
  }
}

export default Textarea;

const { string, shape, func } = PropTypes;

Textarea.propTypes = {
  data: shape({
    text: string,
  }),
  delegate: func,
  settings: map,
};
