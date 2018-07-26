import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindAll } from 'swipes-core-js/classes/utils';
import * as mainActions from 'src/redux/main/mainActions';
import SW from './Modal.swiss';
import * as views from 'src/react/views';

@connect((state, props) => ({
  modal: state.main.getIn(['modals', props.target]),
}), {
  clear: mainActions.modal,
})
export default class HOCModal extends PureComponent {
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
    
    let Comp = modal && modal.component || null;
    if(typeof Comp === 'string') {
      Comp = views[Comp];
    }

    const props = modal && modal.props || {};

    return (
      <SW.Container
        className="modal"
        position={modal && modal.position || 'center'}
        show={modal && !!modal.component}
        onClick={this.clickedBackground}>
        <SW.Content position={modal && modal.position || 'center'}>
          {Comp && <Comp hideModal={this.hideModal} {...props} />}
        </SW.Content>
      </SW.Container>
    );
  }
}
