import React, { Component, PropTypes } from 'react'
import * as Icons from '../../components/icons'
import ReactForm, { Textarea } from '../../components/form'
import { connect } from 'react-redux'
import { modal } from '../../actions'
import { bindAll } from '../../classes/utils'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import '../../components/create-pattern/styles/create-pattern.scss'

class CreatePattern extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [
        {title: 'Collection'},
        {title: 'Note'},
        {title: 'Form'},
        {title: 'Form Result'},
        {title: 'Decision'}
      ],
      currentSteps: [{
        step: null
      }]
    }
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['openModal', 'onKeyUp', 'onBlur', 'addStep', 'selectStep']);
  }
  openModal() {
    const { loadModal } = this.props;
    const { steps } = this.state;

    loadModal({
      title: 'Select a step',
      data: {
        list: {
          items: steps
        }
      }
    }, (res) => {
      if (res) {
        console.log(res);
        console.log(res);
      }
    })
  }
  componentDidMount() {
    setTimeout( () => {
      this.refs.input.focus();
    }, 0)
  }
  onKeyUp() {

  }
  onBlur(e) {
    if (e.keyCode === 13) {
      this.refs.input.blur();
    }
  }
  selectStep() {
    console.log('selectStep');
  }
  addStep() {
    console.log('add step');
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="create-pattern__icon"/>;
    }
  }
  renderHeader() {

    return (
      <div className="create-pattern__header">
        <div className="create-pattern__image">
          {this.renderIcon('ShapeEight')}
        </div>
        <div className="create-pattern__title">
          <input ref="input" className="create-pattern__input" onKeyUp={this.onKeyUp} onBlur={this.onBlur} placeholder="Name your pattern" />
        </div>
      </div>
    )
  }
  renderDescription() {
    const props = {
      fields: [
        { type: 'Textarea', options: { placeholder: 'Pattern description..', maxRows: 7, minRows: 4 } }
      ]
    }

    return (
      <div className="create-pattern__description">
        <ReactForm {...props} />
      </div>
    )
  }
  renderStepList() {
    const { currentSteps } = this.state;
    const renderSteps = [];

    currentSteps.forEach( (step, i) => {
        if (step.step !== null) {

        } else if (step.step === null) {
          renderSteps.push(<div className="create-pattern__step-item create-pattern__step-item--empty" key={'empty-step-item-' + i} onClick={this.openModal}>Click to select a step to add</div>)
        }
    })
    return (
      <div className="create-pattern__step-list">
        {renderSteps}
        <div className="create-pattern__button create-pattern__button--add-step" onClick={this.addStep}>Add a step</div>
      </div>
    )
  }
  render() {
    return (
      <div className="create-pattern">
        {this.renderHeader()}
        {this.renderDescription()}
        {this.renderStepList()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

const ConnectedCreatePattern = connect(mapStateToProps, {
  loadModal: modal.load
})(CreatePattern)
export default ConnectedCreatePattern
