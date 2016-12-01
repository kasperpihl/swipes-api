const mapApiMethod = (method, client) => {
  const arr = method.split('.');
  const len = arr.length;
  let asanaMethod = client;
  let prevAsanaMethod = asanaMethod;

  for (let i = 0; i < len; i += 1) {
    if (!asanaMethod[arr[i]]) {
      return null;
    }

    if (!asanaMethod[arr[i]].bind) {
      asanaMethod = asanaMethod[arr[i]];
    } else {
      asanaMethod = asanaMethod[arr[i]].bind(prevAsanaMethod);
    }

    prevAsanaMethod = asanaMethod;
  }

  return asanaMethod;
};

export default mapApiMethod;
