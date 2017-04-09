import * as ca from './';

export const complete = (id) => (d, getState) => {
  const orgOnboarding = getState().getIn(['me', 'settings', 'onboarding']);
  let onboarding = orgOnboarding;
  onboarding = onboarding.updateIn(['completed'], (arr) => {
    if(!arr.contains(id)){
      arr = arr.push(id);
    }
    return arr;
  });
  if(onboarding !== orgOnboarding) {
    d(ca.me.updateSettings({ onboarding }));
  }
}
