import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as views from 'views';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Button from 'Button';
import './styles/modal.scss';

class HOCModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['hideModal', 'clickedBackground']);
  }
  hideModal() {
    const { clear, target } = this.props;
    clear(target);
  }
  clickedBackground(e) {
    const isBackground = e.target.classList.contains('modal');
    if (isBackground) {
      this.hideModal();
    }
  }
  getProps() {
    const { modal } = this.props;
    return modal && modal.props || {};
  }
  getComponent() {
    const { modal } = this.props;

    let Comp = modal && modal.component;
    if(modal && modal.id) {
      Comp = views[modal.id];
    }
    return Comp || null;
  }
  renderModal(Comp) {
    if (!Comp) {
      return undefined;
    }

    const props = this.getProps();
    return (
      <div className="modal__content">
        <div className="modal__close-button">
          <Button icon="Close" onClick={this.hideModal} />
        </div>
        <Comp hideModal={this.hideModal} {...props} />
      </div>
    );
  }
  render() {
    const Comp = this.getComponent();

    return (
      <div className={`modal ${Comp ? 'modal--shown' : ''}`} onClick={this.clickedBackground}>
        {this.renderModal(Comp)}
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCModal.propTypes = {};

const mapStateToProps = (state, props) => ({
  modal: state.getIn(['main', 'modals', props.target]),
})

export default connect(mapStateToProps, {
  clear: a.main.modal,
})(HOCModal);
