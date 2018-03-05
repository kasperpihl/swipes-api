export default {
  GoalItem: {
    _flex: ['row', 'left', 'center'],
    _size: ['100%', 'auto'],
    backgroundColor: 'white',
    borderBottom: '1px solid $deepBlue10',
    minHeight: '60px',
    overflow: 'hidden',
    padding: '12px',
    paddingRight: 0,
    transition: '.2s ease',

    '&:hover': {
      backgroundColor: '$blue5',
      transition: '.2s ease',
    }
  },
  GoalTitle: {
    _size: ['100%', 'auto'],
    _font: ['15px', '$deepBlue90', '24px', '400'],
    padding: '0 18px',
    transition: '.2s ease',

    inTakeAction: {
      _font: ['15px', '$deepBlue90', '24px', '500'],
    },

    '#{hoverRef}:hover &': {
      color: '$blue100',
      transition: '.2s ease'
    }
  },
  StatusDot: {
    _flex: 'row',
    flex: 'none',
    _size: '12px',
    borderRadius: '50%',
    
    'status=Later|later': {
      backgroundColor: '$deepBlue30',
    },
    'status=Now|now': {
      backgroundColor: '$yellowColor',
    },
    'status=Done|done': {
      backgroundColor: '#12d668'
    },
  },
}