import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import Button from 'Button';
import Loader from 'components/swipes-ui/Loader';
import Section from 'components/section/Section';
import * as actions from 'actions';
import * as Files from './files';
import * as Elements from './elements';
import './preview-modal.scss';

class HOCPreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  renderButtons() {
    const { preview } = this.props;
    const { buttons } = preview || {};

    return (
      <div className="header__actions">
        <Button
          icon="Close"
          className="header__btn header__btn--close"
        />
      </div>
    );
  }
  renderFile(file) {
    if (!file) {
      return undefined;
    }

    const Comp = Object.entries(Files).find(([k, f]) => {
      if (typeof f.supportContentType !== 'function') {
        console.warn(`Preview file ${k} should have static supportContentType`);
        return null;
      }
      return !!f.supportContentType(file.content_type);
    });

    if (!Comp) {
      console.warn(`Unsupported preview file type: ${file.content_type}`);
      return undefined;
    }

    return (
      <Comp file={file} />
    );
  }
  renderElements(elements, hide) {
    if (!elements || hide) {
      return undefined;
    }

    return (
      <div className="preview-card">
        {elements}
      </div>
    );
  }
  renderLoader() {
    const { loading } = this.state;

    if (!loading) {
      return undefined;
    }

    return (
      <div className="preview-modal__loader">
        <Loader center text="Loading" textStyle={{ color: '#333D59', marginTop: '9px' }} />
      </div>
    );
  }
  render() {
    const { preview } = this.props;
    const { elements, file, buttons } = preview || {};
    let className = 'preview-modal';

    if (preview) {
      className += ' preview-modal--shown';
    }

    return (
      <div className={className}>
        <div className="header">
          {this.renderButtons(buttons)}
        </div>
        {this.renderFile(file)}
        {this.renderElements(elements, !!file)}
        {this.renderLoader()}
      </div>
    );
  }
}

const { shape, arrayOf, string, object, oneOf, bool } = PropTypes;

HOCPreviewModal.propTypes = {
  loading: bool,
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
