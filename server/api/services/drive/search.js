const mapSearch = (res) => {
  const idParts = res.id.split('-');

  return {
    service: {
      type: res.source_content_type,
      id: idParts[idParts.length - 1],
      name: 'drive',
    },
    title: res.title,
    subtitle: '',
  };
};

export {
  mapSearch,
};
