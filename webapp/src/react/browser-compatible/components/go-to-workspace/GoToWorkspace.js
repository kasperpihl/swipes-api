import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { styleElement } from 'react-swiss';
import Icon from 'Icon';
import styles from './GoToWorkspace.swiss';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';

const ToWorkspaceWrapper = styleElement('div', styles, 'ToWorkspaceWrapper');
const ToWorkspace = styleElement(Link, styles, 'ToWorkspace');
const SVG = styleElement(Icon, styles, 'SVG');

class GoToWorkspace extends PureComponent {

  render() {
    const { noTitle, to } = this.props;

    return (
      <ToWorkspaceWrapper>
        {!noTitle && <CompatibleSubHeader title="Go to the workspace" />}
        <ToWorkspace to={to || '/'} className="svg-hover">
          <SVG icon="SwipesLogoEmpty"/>
          <p>Go to your Workspace</p>
        </ToWorkspace>
      </ToWorkspaceWrapper>
    );
  }
}

export default GoToWorkspace;

// const { string } = PropTypes;

GoToWorkspace.propTypes = {};
