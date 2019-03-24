import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import SW from './Modal.swiss';

@connect(
  (state, props) => ({
    modal: state.main.getIn(['modals', props.side])
  }),
  {
    clear: mainActions.modal
  }
)
export default class Modal extends PureComponent {
  hideModal = () => {
    const { clear, side } = this.props;
    clear(side);
  };
  clickedBackground = e => {
    if (e.target.classList.contains('Modal_Container')) {
      this.hideModal();
    }
  };
  render() {
    const { modal } = this.props;

    return (
      <SW.Container
        className="modal"
        show={!!modal}
        onClick={this.clickedBackground}
      >
        {modal && modal.component && (
          <modal.component hideModal={this.hideModal} {...modal.props} />
        )}
      </SW.Container>
    );
  }
}
