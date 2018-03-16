export default {
  GradientWrapper: {
    _size: '100%',
    backgroundColor: 'rgba(56,149,252, 1)',
    left: 0,
    top: 0,
    position: 'fixed',
    zIndex: -1,
  },
  SuccessGradient: {
    _size: '100%',
    opacity: 0,
    transition: '0.9s ease-in',
    'color=green': {
      background: 'linear-gradient(135deg, rgba(147,247,190,1) 0%, rgba(34,208,112,1) 100%)',
    },
    'color=red': {
      background: 'linear-gradient(135deg, #EC6583 0%, #F8A39D 100%)',
    },
    show: {
      opacity: 1,
      transition: '.3s ease-in',
    }
  },
}