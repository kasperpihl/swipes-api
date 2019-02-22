import React from 'react';
import SW from './ProgressCircle.swiss';

const ProgressCircle = props => {
  const rotation = (props.progress / 100) * 180;

  return (
    <SW.RadialCircle>
      <SW.Progress>
        <SW.Mask prog={rotation}>
          <SW.Fill prog={rotation} />
        </SW.Mask>
        <SW.Mask left>
          <SW.Fill prog={rotation} />
          <SW.Fill fix prog={rotation} />
        </SW.Mask>
      </SW.Progress>
    </SW.RadialCircle>
  );
};

export default ProgressCircle;
