import React, { PureComponent } from 'react';

// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';

import { Link } from 'react-router-dom';
import Icon from 'Icon';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import './styles/go-to-workspace.scss';

class GoToWorkspace extends PureComponent {

  render() {
    const { noTitle, to } = this.props;

    return (
      <div className="to-workspace">
        {!noTitle && <CompatibleSubHeader title="Go to the workspace" />}
        <Link to={to || '/'} className="to-workspace__wrapper">
          <Icon icon="SwipesLogoEmpty" className="to-workspace__svg" />
          <p>Go to your Workspace</p>
        </Link>
      </div>
    );
  }
}

export default GoToWorkspace;

// const { string } = PropTypes;

GoToWorkspace.propTypes = {};
