const mapApiMethod = (method, client) => {
  const arr = method.split('.');
  const len = arr.length;
  let jiraMethod = client;
  let prevJiraMethod = jiraMethod;

  for (let i = 0; i < len; i += 1) {
    if (!jiraMethod[arr[i]]) {
      return null;
    }

    if (!jiraMethod[arr[i]].bind) {
      jiraMethod = jiraMethod[arr[i]];
    } else {
      jiraMethod = jiraMethod[arr[i]].bind(prevJiraMethod);
    }

    prevJiraMethod = jiraMethod;
  }

  return jiraMethod;
};

export default mapApiMethod;
