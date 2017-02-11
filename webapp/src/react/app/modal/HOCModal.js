import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import SwipesModal from 'src/react/modals/SwipesModal';
import * as a from 'actions';

import { bindAll } from 'classes/utils';

class HOCModal extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['onModalCallback', 'closeModal', 'onKeyUp']);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    window.addEventListener('keyup', this.onKeyUp);
  }
  componentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyUp);
  }
  onKeyUp(e) {
    const { modal } = this.props;

    if (e.keyCode === 27 && modal && modal.props) {
      this.onModalCallback(null);
    }
  }

  onModalCallback(res) {
    const { modal, loadModal } = this.props;

    if (modal.callback) {
      modal.callback(res);
    }

    loadModal(null);
  }
  closeModal() {
    this.onModalCallback(null);
  }
  renderModal(props) {
    const { modal } = this.props;

    if (!modal || !modal.props) {
      return undefined;
    }

    return <SwipesModal callback={this.onModalCallback} {...props} />;
  }
  render() {
    const { modal } = this.props;
    let className = 'g-modal';
    let props = {};
    if (modal && modal.props) {
      className += ' g-modal--shown';
      props = modal.props;
    }
    return (
      <div className={className}>
        <div className="g-modal__overlay" onClick={this.closeModal} />
        {this.renderModal(props)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.getIn(['main', 'modal']),
  };
}

const ConnectedHOCModal = connect(mapStateToProps, {
  loadModal: a.main.modal,
})(HOCModal);

const { func, object } = PropTypes;

HOCModal.propTypes = {
  modal: object,
  loadModal: func,
};

export default ConnectedHOCModal;
