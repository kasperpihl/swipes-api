on 'rtm.start'
mixpanel.identify(action.payload.self.id);
mixpanel.people.set({
  "$email": action.payload.self.email,
  "$created": action.payload.self.created,
  "$name": action.payload.self.name
})