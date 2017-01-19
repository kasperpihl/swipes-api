const mapSearch = (res) => {
  const idParts = res.id.split('-');

  return {
    service: {
      type: 'file',
      id: `rev:${idParts[idParts.length - 1]}`,
      name: 'dropbox',
    },
    title: res.filename,
    subtitle: res.filepath || '/',
  };
};

export {
  mapSearch,
};
