import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import SwipesModal from '../../modals/SwipesModal';
import PreviewModal from '../../modals/PreviewModal';
import { modal as modalActions } from 'actions';

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

    if (e.keyCode === 27 && modal && modal.get('shown')) {
      this.onModalCallback(null);
    }
  }

  onModalCallback(res) {
    const { modal, hideModal } = this.props;

    if (modal.get('callback')) {
      modal.get('callback')(res);
    }

    hideModal();
  }
  closeModal() {
    this.onModalCallback(null);
  }
  renderModal(type, props) {
    const { modal } = this.props;

    if (!modal.get('shown')) {
      return undefined;
    }

    let Comp = SwipesModal;

    if (type === 'preview') {
      Comp = PreviewModal;
    }

    return <Comp callback={this.onModalCallback} {...props} />;
  }
  render() {
    const { modal } = this.props;
    const props = modal.get('props') || {};
    const type = modal.get('type');
    let className = 'g-modal';

    if (modal.get('shown')) {
      className += ' g-modal--shown';
    }
    return (
      <div className={className}>
        <div className="g-modal__overlay" onClick={this.closeModal} />
        {this.renderModal(type, props)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.get('modal'),
  };
}

const ConnectedHOCModal = connect(mapStateToProps, {
  hideModal: modalActions.hide,

})(HOCModal);

const { func } = PropTypes;

HOCModal.propTypes = {
  modal: map,
  hideModal: func,
};

export default ConnectedHOCModal;
