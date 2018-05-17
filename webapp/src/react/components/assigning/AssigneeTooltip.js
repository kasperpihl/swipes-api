import React from 'react';
import { styleElement, styleSheet } from 'react-swiss';
import AssigneeImage from './AssigneeImage';

const styles = styleSheet('AssigneeTooltip', {
  Wrapper: {
    _size: ['180px', 'auto'],
    boxShadow: '0 1px 20px 3px rgba($sw1  ,0.1)',
    backgroundColor: '$sw5',
    overflowY: 'auto',
    padding: '9px 0',
    maxHeight: '400px',
  },
  Item: {
    _flex: ['row', 'left', 'center'],
    padding: '6px',
    _size: ['100%', '36px'],
  },
  ImageWrapper: {
    _flex: 'center',
    _size: '24px',
    background: '$sw2',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  Name: {
    _font: ['12px', '18px', 500],
    _truncateString: '',
    paddingLeft: '15px',
  },
});

const Wrapper = styleElement('div', styles.Wrapper);
const Item = styleElement('div', styles.Item);
const ImageWrapper = styleElement('div', styles.ImageWrapper);
const Name = styleElement('div', styles.Name);

export default (props) => {
  const {
    assignees,
    size,
  } = props;

  return (
    <Wrapper>
      {assignees.map((user, i) => (
        <Item key={i}>
          <ImageWrapper>
            <AssigneeImage user={user} size={size} />
          </ImageWrapper>
          <Name>{msgGen.users.getFullName(user)}</Name>
        </Item> 
      ))}
    </Wrapper>
  );
};