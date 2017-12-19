import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
// import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import Loader from 'components/loaders/Loader';
import './styles/add-milestone.scss';

class AddMilestone extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
    };
    setupDelegate(this, 'onAddMilestone');
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }
  componentDidMount() {
  }
  onChange(e) {
    this.setState({ title: e.target.value });
  }
  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.onAddMilestone(this.state.title);
      this.setState({ title: '' });
    }
  }
  handleFocus() {
    const { addMilestoneInput } = this.refs;

    addMilestoneInput.focus();
  }
  renderInput() {
    const { title } = this.state;

    return (
      <div className="add-milestone__header">
        <input
          ref="addMilestoneInput"
          value={title}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          placeholder="Add a new plan"
        />
      </div>
    )
  }
  renderAdd() {
    const { isLoading } = this.props;
    const { title } = this.state;
    let iconClassName = 'add-milestone__svg';
    let loaderClassName = 'add-milestone__loader';

    if (title.length > 0) {
      iconClassName += ' add-milestone__svg--active'
    }

    if (isLoading('add')) {
      iconClassName += ' add-milestone__svg--hidden';
      loaderClassName += ' add-milestone__loader--show';
    }

    return (
      <div className="add-milestone__body">
        <div className="add-milestone__icon-wrapper">
          <Icon icon="Plus" className={iconClassName} />
        </div>
        <div className={loaderClassName}>
          {isLoading('add') && <Loader center size={60} />}
        </div>
      </div>
    )
  }
  render() {
    const { isLoading } = this.props;
    const { title } = this.state;
    let className = 'add-milestone';

    if (title.length > 0) {
      className += ' add-milestone--active'
    }

    if (isLoading('add')) {
      className += ' add-milestone--loading'
    }

    return (
      <div className={className} onClick={this.handleFocus}>
        {this.renderInput()}
        {this.renderAdd()}
      </div>
    )
  }
}

export default AddMilestone

// const { string } = PropTypes;

AddMilestone.propTypes = {};
