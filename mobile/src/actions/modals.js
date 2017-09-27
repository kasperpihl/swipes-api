import ActionModal from 'modals/action-modal/ActionModal';
import AlertModal from 'modals/AlertModal';
import LoadingModal from 'modals/LoadingModal';
import { modal } from './main';
import { fromJS } from 'immutable';
import * as cs from 'swipes-core-js/selectors';

export const action = (props, extraArgs) => (d, getState) => {

  const renderedProps = {
    ...props,
  };

  d(modal({
    component: ActionModal,
    props: renderedProps,
    ...extraArgs,
  }));
} 

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

  d(action(renderedProps));
}

export const alert = (props, extraArgs) => (d) => {

  const renderedProps = {
    ...props,
  };

  d(modal({
    component: AlertModal,
    props: renderedProps,
    ...extraArgs,
  }));
} 

export const loading = (isLoading, props) => (d) => {
  if(!isLoading) {
    return d(modal());
  }
  return d(modal({
    component: LoadingModal,
    props: props || null,
    modalProps: {
      isDisabled: true,
    }
  }));
}
