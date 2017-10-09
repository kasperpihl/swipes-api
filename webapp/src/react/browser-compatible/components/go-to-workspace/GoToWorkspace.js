import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import { Link } from 'react-router-dom';
import Icon from 'Icon';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import './styles/go-to-workspace.scss';

class GoToWorkspace extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="to-workspace">
        <CompatibleSubHeader title="Go to the workspace" />
        <Link to="/" className="to-workspace__wrapper">
          <Icon icon="SwipesLogoEmpty" className="to-workspace__svg" />
          <p>Go to the workspace</p>
        </Link>
      </div>
    );
  }
}

export default GoToWorkspace

// const { string } = PropTypes;

GoToWorkspace.propTypes = {};