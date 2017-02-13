const mapSearch = (res) => {
  const id = res.id.split(/-(.+)/)[1];

  return {
    service: {
      id: `rev:${id}`,
      name: 'dropbox',
      type: 'file',
      content_type: res.source_content_type,
    },
    title: res.filename,
    subtitle: res.filepath || '/',
  };
};

export {
  mapSearch,
};
