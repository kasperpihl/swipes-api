import { styleSheet } from 'swiss-react';

export default styleSheet('PlanList', {
  Wrapper: {
    _size: '100%',
    padding: '0 30px'
  },
  Section: {
    _flex: ['row', 'left', 'top'],
    flexWrap: 'wrap'
  },
  SectionTitle: {
    width: '100%',
    borderBottom: '1px solid $sw3'
  }
});
