import ActionModal from 'modals/action-modal/ActionModal';
import { modal } from './main';
import { fromJS } from 'immutable';
import * as cs from 'swipes-core-js/selectors';

export const assign = (props) => (d, getState) => {

  const users = cs.users.getActive(getState());

  const userInfoToActions = users.map(u => fromJS({
    id: u.get('id'),
    title: msgGen.users.getFullName(u.get('id')),
    leftIcon: {
      user: u.get('id'),
    },
  }));

  const renderedProps = {
    title: 'Assign teammates',
    multiple: true,
    actionLabel: 'Assign',
    items: userInfoToActions,
    fullscreen: true,
    ...props
  };

  d(modal({
    component: ActionModal,
    props: renderedProps,
  }));
}