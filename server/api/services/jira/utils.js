import JiraClient from 'jira-connector';

const createClient = (url, username, password) => {
  const escapedUrl = url.replace(/http(s)?:?\/?\/?/, '');
  const client = new JiraClient({
    host: escapedUrl,
    basic_auth: {
      username,
      password,
    },
  });

  return client;
};

export {
  createClient,
};
