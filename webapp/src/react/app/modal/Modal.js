import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import { connect } from 'react-redux';
import * as a from 'actions';
import { bindAll } from 'swipes-core-js/classes/utils';
import styles from './Modal.swiss';

const Container = styleElement('div', styles.Container);
const Content = styleElement('div', styles.Content);

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
  render() {
    const { modal } = this.props;
    
    const Comp = modal && modal.component || null;
    const props = modal && modal.props || {};

    return (
      <Container
        className="modal"
        position={modal && modal.position || 'center'}
        show={modal && !!modal.component}
        onClick={this.clickedBackground}>
        <Content position={modal && modal.position || 'center'}>
          {Comp && <Comp hideModal={this.hideModal} {...props} />}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => ({
  modal: state.getIn(['main', 'modals', props.target]),
})

export default connect(mapStateToProps, {
  clear: a.main.modal,
})(HOCModal);
