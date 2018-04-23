import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import styles from './SwipesIntro.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Img = styleElement('img', styles.Img);

const SwipesIntro = () => (
  <SWView 
    header={(
      <HOCHeaderTitle
        title="Learn the Workspace"
        subtitle="Understand the basics with this simple guide"
        border={true}
      />
    )}>
    <Wrapper>
      <Img src="https://s3-us-west-2.amazonaws.com/live.swipesapp.com/uploads/ONY8E94FL/1508152151-URU3EUPOE/swipes-workspace-learn-diagram.png" />
    </Wrapper>
  </SWView>
);

export default SwipesIntro;
