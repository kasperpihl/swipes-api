import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/add-milestone.scss';

class AddMilestone extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
    };
    setupDelegate(this);
    this.callDelegate.bindAll('onAddMilestone');
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }
  componentDidMount() {
  }
  onChange(e) {
    this.setState({ title: e.target.value });
  }
  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.onAddMilestone(this.state.title);
    }
  }
  renderInput() {
    const { title } = this.state;

    return (
      <div className="add-milestone__header">
        <input value={title} onChange={this.onChange} onKeyDown={this.onKeyDown} placeholder="Add new milestone" />
      </div>
    )
  }
  renderAdd() {
    const { title } = this.state;
    let className = 'add-milestone__svg';

    if (title.length > 0) {
      className += ' add-milestone__svg--active'
    }

    return (
      <div className="add-milestone__body">
        <Icon icon="Plus" className={className} />
      </div>
    )
  }
  render() {
    const { isLoading, getLoading } = this.props;
    return (
      <div className="add-milestone">
        {this.renderInput()}
        {this.renderAdd()}
      </div>
    )
  }
}

export default AddMilestone

// const { string } = PropTypes;

AddMilestone.propTypes = {};
