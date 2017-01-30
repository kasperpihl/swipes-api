const mapSearch = (res) => {
  const idParts = res.id.split('-');

  return {
    service: {
      type: res.content_type,
      id: idParts[idParts.length - 1],
      name: 'gmail',
    },
    title: res.subject,
    subtitle: res.from || '/',
  };
};

export {
  mapSearch,
};
