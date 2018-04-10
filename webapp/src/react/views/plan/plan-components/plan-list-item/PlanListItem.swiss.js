export default {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'left', 'center'],
    padding: '24px 12px',
    borderBottom: '1px solid $sw4',
  },
  TextWrapper: {
    _flex: ['column', 'left', 'top'],
    marginLeft: '24px',
    width: '100%',
  },
  Title: {
    _font: ['15px', '24px', 300],
    color: '$sw1'
  },
  Subtitle: {
    _font: ['12px', '18px', 400],
    color: '$sw2',
    marginTop: '6px',
  },
  ProgressBar: {
    _size: ['120px', '24px'],
    background: 'rgba($green, 0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
    '&:before': {
      content: '',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '24px',
      background: '$green',
      zIndex: 2,
      width: ({ goalPercentage }) => `${Math.max(goalPercentage, 4)}%`,
    },
    '&:after': {
      content: '',
      position: 'absolute',
      zIndex: 1,
      bottom: 0,
      left: 0,
      width: ({ stepPercentage, goalPercentage }) => {
        if(!stepPercentage) return '0%';
        const remainingPercentage = 100 - Math.max(goalPercentage, 4);
        const extraWidth = (remainingPercentage / 100) * stepPercentage;
        return `${goalPercentage + extraWidth}%`;
      },
      height: '24px',
      background: 'rgba($green, 0.3)',
    }
  },
}