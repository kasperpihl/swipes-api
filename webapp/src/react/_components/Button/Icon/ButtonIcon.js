import React from 'react';
import SW from './ButtonIcon.swiss';

export default function ButtonIcon(props) {
  let { icon, status } = props;

  switch (status) {
    case 'Standard': {
      if (!icon) {
        return null;
      }
      break;
    }
    case 'Loading':
      return <SW.LoaderCircle />;
    default:
      return null;
  }
  return (
    <SW.IconWrapper>
      <SW.Icon icon={icon} />
    </SW.IconWrapper>
  );
}
