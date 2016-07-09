on 'rtm.start'
amplitude.setUserId(action.payload.self.id);
mixpanel.identify(action.payload.self.id);
mixpanel.people.set({
  "$email": action.payload.self.email,
  "$created": action.payload.self.created,
  "$name": action.payload.self.name
})

