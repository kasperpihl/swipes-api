const bindAll = (context, methodNames) => {
  methodNames.map(function(methodName) {
    context[methodName] = context[methodName].bind(context);
  });
}
const size = (obj) => {
  if (obj == null) return 0;
  return Object.keys(obj).length;
}

export {
  bindAll,
  size
}