import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { styleElement } from 'swiss-react';
import Icon from 'Icon';
import styles from './GoToWorkspace.swiss';
import CompatibleSubHeader from 'compatible/components/subheader/CompatibleSubHeader';

const Wrapper = styleElement('div', styles.Wrapper);
const ATag = styleElement(Link, styles.ATag);
const SVG = styleElement(Icon, styles.SVG);

class GoToWorkspace extends PureComponent {

  render() {
    const { noTitle, to } = this.props;

    return (
      <Wrapper>
        {!noTitle && <CompatibleSubHeader title="Go to the workspace" />}
        <ATag to={to || '/'} className="svg-hover">
          <SVG icon="SwipesLogoEmpty"/>
          <p>Go to your Workspace</p>
        </ATag>
      </Wrapper>
    );
  }
}

export default GoToWorkspace;
