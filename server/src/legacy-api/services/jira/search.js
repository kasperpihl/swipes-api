const mapSearch = (res) => {
  const id = res.id.split(/-(.+)/)[1];

  return {
    service: {
      id,
      type: res.content_type,
      content_type: res.source_content_type,
      name: 'jira',
    },
    title: res.title,
    subtitle: res.folder.join(', '),
  };
};

export {
  mapSearch,
};
