import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import SW from './Modal.swiss';

@connect(
  (state, props) => ({
    modal: state.main.getIn(['modals', props.target])
  }),
  {
    clear: mainActions.modal
  }
)
export default class Modal extends PureComponent {
  hideModal = () => {
    const { clear, target } = this.props;
    clear(target);
  };
  clickedBackground = e => {
    const isBackground =
      e.target.classList.contains('Modal_Container') ||
      e.target.classList.contains('Modal_Content');
    if (isBackground) {
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
        <SW.Content>
          {modal && modal.component && (
            <modal.component hideModal={this.hideModal} {...modal.props} />
          )}
        </SW.Content>
      </SW.Container>
    );
  }
}
