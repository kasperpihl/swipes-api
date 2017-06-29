import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
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
    const { isLoading } = this.props;
    const { title } = this.state;
    let iconClassName = 'add-milestone__svg';
    let loaderClassName = 'add-milestone__loader';

    if (title.length > 0) {
      iconClassName += ' add-milestone__svg--active'
    }

    if (isLoading) {
      iconClassName += ' add-milestone__svg--hidden';
      loaderClassName += ' add-milestone__loader--show';
    }

    return (
      <div className="add-milestone__body">
        <Icon icon="Plus" className={iconClassName} />
        <div className={loaderClassName}>
          <Loader center size={60} />
        </div>
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
