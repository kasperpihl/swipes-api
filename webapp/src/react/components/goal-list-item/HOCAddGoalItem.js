import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { setupLoading, bindAll, toUnderscore } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { setupDelegate } from 'react-delegate';
import HOCAssigning from 'components/assigning/HOCAssigning';
import RotateLoader from 'components/loaders/RotateLoader';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';
import Button from 'Button';
import './styles/add-goal-item.scss';

class HOCAddGoalItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      assignees: fromJS(props.defAssignees || []),
      milestoneId: props.milestoneId || null,
      addFocus: false,
    };

    this.acOptions = {
      types: ['users'],
      delegate: this,
      trigger: "@",
    };

    bindAll(this, ['onChange', 'onKeyDown', 'onFocus', 'onBlur', 'onGoalAdd']);
    setupDelegate(this, 'onAddGoalItemInputChange');
    setupLoading(this);
  }
  onFocus() {
    this.setState({ addFocus: true });
  }
  onBlur(i) {
    this.setState({ addFocus: false });
  }
  onGoalAdd() {
    console.log('add me!');
    const { createGoal } = this.props;
    const { title, assignees, milestoneId } = this.state;

    this.setLoading('add', 'Adding...');

    createGoal(title, milestoneId, assignees.toJS()).then((res) => {
      this.clearLoading('add');

      if (res.ok) {
        this.setState({
          title: '',
          assignees: fromJS(this.props.defAssignees || []),
        });
      }
    });
  }
  onAssign(i, e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees } = this.props;
    const { assignees } = this.state;
    let overrideAssignees;
    options.onClose = () => {
      this.refs.autocomplete.refs.input.focus();
      if (overrideAssignees) {
        this.setState({ assignees: fromJS(overrideAssignees) });
      }
    }
    selectAssignees(options, assignees.toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      }
    });
    e.stopPropagation();
  }
  onAutoCompleteSelect(item) {
    let { assignees, title } = this.state;
    if (!assignees.contains(item.id)) {
      assignees = assignees.push(item.id);
    }
    const msgArr = title.split('@');
    title = msgArr.slice(0, -1).join('@');
    this.setState({ title, assignees });
  }
  onChange(e) {
    const value = e.target.value;
    this.setState({ title: value });

    this.onAddGoalItemInputChange(value);
  }
  onKeyDown(e) {
    if (e.keyCode === 13 && e.target.value.length > 0) {
      this.onGoalAdd();
    }
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  render() {
    const { placeholder } = this.props;
    const { title, assignees, addFocus } = this.state;
    let value = title;

    let addClass = 'add-goal-item';

    if (addFocus || title.length) {
      addClass += ' add-goal-item--focused';
    }

    if (title.length && !this.isLoading('add')) {
      addClass += ' add-goal-item--active'
    }

    if (this.isLoading('add')) {
      addClass += ' add-goal-item--loading';
      value = this.getLoading('add').loading;
    }

    return (
      <div className={addClass}>
        <AutoCompleteInput
          nodeType="input"
          type="text"
          ref="autocomplete"
          className="add-goal-item__input"
          value={value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          placeholder={placeholder || 'Add a new goal'}
          options={this.acOptions}
        />
        <div className="add-goal-item__indicator">
          <div className="add-goal-item__loader">
            <RotateLoader size={24} />
          </div>
        </div>
        <div className="add-goal-item__assignees">
          <HOCAssigning
            assignees={assignees}
            delegate={this}
            rounded
            size={26}
          />
        </div>
        <div className="add-goal-item__button" onClick={this.onGoalAdd} >
          <Button icon="subdirectory_arrow_left" small frameless/>
        </div>
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCAddGoalItem.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  selectAssignees: a.goals.selectAssignees,
  createGoal: ca.goals.create,
})(HOCAddGoalItem);
