import { styleSheet } from 'swiss-react';

export default styleSheet('DiscussionList', {
  Wrapper: {
    flex: '1',
    flexDirection: 'column',
  },
  List: {
    flex: '1',
  },
  LoaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  PlusButtonContainer: {
    width: '44',
    height: '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
