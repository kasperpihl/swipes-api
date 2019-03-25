import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import SW from './Modal.swiss';

export default connect(
  (state, props) => ({
    modal: state.main.getIn(['modals', props.side])
  }),
  {
    clear: mainActions.modal
  }
)(Modal);

function Modal({ modal, clear, side }) {
  const hideModal = () => {
    clear(side);
  };

  useEffect(() => {
    if (!modal) return;
    const handleKeyDown = e => {
      if (e.keyCode === 27) {
        hideModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modal]);

  const clickedBackground = e => {
    if (e.target.classList.contains('Modal_Container')) {
      hideModal();
    }
  };

  return (
    <SW.Container className="modal" show={!!modal} onClick={clickedBackground}>
      {modal && modal.component && (
        <modal.component hideModal={hideModal} {...modal.props} />
      )}
    </SW.Container>
  );
}
