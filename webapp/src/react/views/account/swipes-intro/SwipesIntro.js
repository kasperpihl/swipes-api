import React, { PureComponent } from 'react';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SW from './SwipesIntro.swiss';

const SwipesIntro = () => (
  <SWView 
    header={(
      <HOCHeaderTitle
        title="Learn the Workspace"
        subtitle="Understand the basics with this simple guide"
        border={true}
      />
    )}>
    <SW.Wrapper>
      <SW.Img src="https://s3-us-west-2.amazonaws.com/live.swipesapp.com/uploads/ONY8E94FL/1508152151-URU3EUPOE/swipes-workspace-learn-diagram.png" />
    </SW.Wrapper>
  </SWView>
);

export default SwipesIntro;
