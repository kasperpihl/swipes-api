import React from 'react';
import { element } from 'react-swiss';

const Wrapper = element('div', {
  _font: ['11px', '18px', 500],
  textTransform: 'capitalize',
  color: '$post',
  '&:after': {
    content: '',
    display: 'inline-block',
    width: '12px',
    height: '12px',
    transform: 'translateY(2px)',
    marginLeft: '6px',
    borderRadius: '6px',
    backgroundColor: '$post',
  },
  'type=announcement': {
    color: '$announcement',
    '&:after': {
      backgroundColor: '$announcement',
    },
  },
  'type=question': {
    color: '$question',
    '&:after': {
      backgroundColor: '$question',
    },
  },
  'type=information': {
    color: '$information',
    '&:after': {
      backgroundColor: '$information',
    },
  },
});

const PostType = ({ type, ...rest }) => (
  <Wrapper type={type} {...rest}>{type === 'message' && 'post' || type}</Wrapper>
);

export default PostType;