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
export default class HOCModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
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

    const Comp = (modal && modal.component) || null;

    const props = (modal && modal.props) || {};

    return (
      <SW.Container
        className="modal"
        position={(modal && modal.position) || 'center'}
        show={modal && !!modal.component}
        onClick={this.clickedBackground}
      >
        <SW.Content position={(modal && modal.position) || 'center'}>
          {Comp && <Comp hideModal={this.hideModal} {...props} />}
        </SW.Content>
      </SW.Container>
    );
  }
}
