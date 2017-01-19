const mapSearch = (res) => {
  const idParts = res.id.split('-');

  return {
    type: 'file',
    id: `rev:${idParts[idParts.length - 1]}`,
    title: res.filename,
    subtitle: res.filepath || '/',
  };
};

export {
  mapSearch,
};
