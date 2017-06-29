import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
// import './styles/add-milestone.scss';

class AddMilestone extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
    };
    setupDelegate(this);
    this.callDelegate.bindAll('onAddMilestone');
  }
  componentDidMount() {
  }
  onChange(e) {
    this.setState({ title: e.target.value });
  }
  onKeyDown(e) {
    if(e.keyCode === 13) {
      this.onAddMilestone(this.state.title);
    }
  }
  render() {
    const { isLoading, getLoading } = this.props;
    return (
      <div className="add-milestone">
        hello
      </div>
    )
  }
}

export default AddMilestone

// const { string } = PropTypes;

AddMilestone.propTypes = {};
