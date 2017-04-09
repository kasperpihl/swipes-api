import * as ca from './';

export const complete = (id) => (d, getState) => {
  const orgOnboarding = getState().getIn(['me', 'settings', 'onboarding']);
  let onboarding = orgOnboarding;
  onboarding = onboarding.updateIn(['completed'], (completed) => {
    if(!completed.get(id)){
      completed = completed.set(id, true);
    }
    return completed;
  });
  if(onboarding !== orgOnboarding) {
    d(ca.me.updateSettings({ onboarding: onboarding.toJS() }));
  }
}
