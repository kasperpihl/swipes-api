const mapSearch = (res) => {
  const id = res.id.split(/-(.+)/)[1];

  return {
    service: {
      id,
      content_type: res.source_content_type,
      type: 'file',
      name: 'drive',
    },
    title: res.title,
    subtitle: '',
  };
};

export {
  mapSearch,
};
