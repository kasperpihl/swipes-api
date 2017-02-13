const mapSearch = (res) => {
  console.log(res);
  return {};
  const id = res.id.split(/-(.+)/)[1];

  return {
    service: {
      type: 'file',
      id: `rev:${id}`,
      name: 'dropbox',
    },
    title: res.filename,
    subtitle: res.filepath || '/',
  };
};

export {
  mapSearch,
};
