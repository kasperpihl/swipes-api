import { element } from 'react-swiss';

export default element({
  name: 'Dropzone',
  className: 'dropzone'
}, {
  userSelect: 'all',
  // position: 'absolute',
  height: '200px',
  width: '100%',
  // top: '5px',
  // left: 0,
  display: 'none',
  background: 'rgba(0, 0, 0, 0.8)',
  border: '2px dashed white',
  zIndex: 999999,
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.6)',
    border: '2px dashed yellow',
  },
  active: {
    display: 'block',
  }
})