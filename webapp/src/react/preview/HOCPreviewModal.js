import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';
import * as Files from './files';
import * as Elements from './elements';

class HOCPreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  renderButtons() {
    const { buttons } = this.props.preview;
  }
  renderFile() {
    const { file } = this.props.preview;
  }
  renderElements() {
    const { elements, file } = this.props.preview;
    if (file || !elements) {
      return undefined;
    }
  }
  render() {
    return (
      <div className="preview-modal" />
    );
  }
}

const { shape, arrayOf, string, object, oneOf } = PropTypes;

HOCPreviewModal.propTypes = {
  preview: shape({
    buttons: arrayOf(shape({
      title: string,
      icon: string,
      url: string,
      command: shape({
        name: string,
        params: object,
      }),
    })),
    file: shape({
      content_type: string,
      url: string,
      metadata: object,
    }),
    elements: arrayOf(shape({
      // supported elements
      type: oneOf(['header']),
      data: object,
    })),
  }),
};

function mapStateToProps(state) {
  return {
    preview: state.getIn(['main', 'preview']),
  };
}

export default connect(mapStateToProps, {
  closePreview: actions.main.preview,
})(HOCPreviewModal);
