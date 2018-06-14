import React, { PureComponent } from 'react';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';
import SW from './GoToWorkspace.swiss';

class GoToWorkspace extends PureComponent {

  render() {
    const { noTitle, to } = this.props;

    return (
      <SW.Wrapper>
        {!noTitle && <CompatibleSubHeader title="Go to the workspace" />}
        <SW.ATag to={to || '/'} className="svg-hover">
          <SW.SVG icon="SwipesLogoEmpty"/>
          <p>Go to your Workspace</p>
        </SW.ATag>
      </SW.Wrapper>
    );
  }
}

export default GoToWorkspace;
