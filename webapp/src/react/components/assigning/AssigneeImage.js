import React from 'react';
import { styleElement, styleSheet } from 'swiss-react';

const styles = styleSheet('AssigneeImage', {
  Image: {
    _size: '100%',
    _borderRadius: '50%',
    // Fixes wierd bug where in the plan view if the user drags and item from the first column
    // it can see glitches in the photos in the second column
    transform: 'translateZ(0)',
    blackAndWhite: {
      filter: 'grayscale(100%)',
    }
  },
  Initials: {
    _font: ['10px', '18px', 500],
    'size>=30': {
      _font: ['12px', '18px', 500],
    },
    color: '$sw5',
    textTransform: 'uppercase',
  },
});

const Image = styleElement('img', styles.Image);
const Initials = styleElement('div', styles.Initials);

export default (props) => {
  const { user, blackAndWhite } = props;
  const pic = msgGen.users.getPhoto(user);
  const fullName = msgGen.users.getFullName(user);
  const initials = msgGen.users.getInitials(user);

  if(pic) return (
    <Image src={pic} alt={fullName} blackAndWhite={blackAndWhite} />
  );
  return (
    <Initials>{initials}</Initials>
  );
};
