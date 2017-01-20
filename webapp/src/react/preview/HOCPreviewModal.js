import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { bindAll } from 'classes/utils';
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
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['onClose']);
  }
  componentDidMount() {
  }
  onClose() {
    const { closePreview } = this.props;
    closePreview();
  }
  renderButtons() {
    const { preview } = this.props;
    const { buttons } = preview || {};

    return (
      <div className="header__actions">
        <Button
          icon="Close"
          className="header__btn header__btn--close"
          onClick={this.onClose}
        />
      </div>
    );
  }
  renderFile(file) {
    if (!file) {
      return undefined;
    }

    let Comp = Object.entries(Files).find(([k, f]) => {
      console.log(k, f);
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
    Comp = Comp[1];
    console.log(Comp);

    return (
      <div className="preview-modal__file">
        <Comp file={file} />
      </div>
    );
  }
  renderElements(elements, hide) {
    if (!elements || hide) {
      return undefined;
    }

    const renderedElements = elements.map((el, i) => {
      const Comp = Object.entries(Elements).find(([k, Element]) => {

      });
      if (!Comp) {
        return null;
      }
      return (
        <Section key={i}>
          <Comp element={el} />
        </Section>
      );
    });
    return (
      <div className="preview-modal__card">
        {renderedElements}
      </div>
    );
  }
  renderLoader(loading) {
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
    const { elements, file, buttons, loading } = preview || {};
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
        {this.renderLoader(loading)}
      </div>
    );
  }
}

const { shape, arrayOf, string, object, oneOf, bool, func } = PropTypes;

HOCPreviewModal.propTypes = {
  closePreview: func,
  preview: shape({
    loading: bool,
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
