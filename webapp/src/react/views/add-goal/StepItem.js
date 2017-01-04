import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from 'actions';
import { List } from 'immutable';
import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning';
import { list } from 'react-immutable-proptypes';
import { setupDelegate, bindAll } from 'classes/utils';

class HOCStepItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      add: props.add ? 'add' : undefined,
      title: props.title || '',
      submission: {
        response: 'default',
        type: 'single',
      },
    };
    bindAll(this, ['onKeyUp', 'onKeyDown', 'onChange', 'onBlur', 'onFocus']);
    this.callDelegate = setupDelegate(props.delegate, this.state.add || props.index);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {

  }

  onFocus() {
    this._title = this.state.title;
  }
  onBlur() {
    if (!this.state.add) {
      this.callback();
    }
    this._title = undefined;
  }
  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.callback(true, true); // Don't force, move to next.
    }
  }
  onKeyDown(e) {

  }
  onChange(e) {
    this.setState({ title: e.target.value });
  }
  clickedAssign(e) {
    this.callDelegate('clickedAssign', e);
  }
  callback(force, next) {
    const { title, add } = this.state;
    const { assignees } = this.props;
    if (!title.length && this._title) {
      this.setState({ title: this._title });
    } else if (title !== this._title || force) {
      this.callDelegate('updateStepData', {
        title,
        assignees,
      }, next);
      if (add) {
        this.setState({ title: '' });
        this._title = '';
      }
    }
  }
  renderIndex() {
    const { index, add } = this.props;
    let renderIndex = index + 1;
    if (add) {
      renderIndex = <Icon svg="AddIcon" className="add-goal__icon" />;
    }
    return <div className="add-goal__step-index">{renderIndex}</div>;
  }
  render() {
    const { title } = this.state;
    const { add, assignees } = this.props;

    return (
      <div className="add-goal__step-item">
        {this.renderIndex()}
        <input
          ref="stepItemInput"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          type="text"
          className="add-goal__step-name"
          placeholder={add ? 'Add new step' : 'Enter Step Name'}
          value={title}
        />
        <HOCAssigning delegate={this} assignees={assignees} />
      </div>
    );
  }
}

const { array, number, bool, object, string } = PropTypes;

HOCStepItem.propTypes = {
  index: number,
  assignees: list,
  delegate: object,
  title: string,
  add: bool,
};


function mapStateToProps(state) {
  return {
    main: state.get('main'),
  };
}

export default connect(mapStateToProps, {
  setStatus: actions.main.setStatus,
})(HOCStepItem);
