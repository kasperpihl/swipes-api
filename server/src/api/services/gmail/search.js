const mapSearch = (res) => {
  const id = res.id.split(/-(.+)/)[1];

  return {
    service: {
      id,
      content_type: res.content_type,
      type: res.content_type,
      name: 'gmail',
    },
    title: res.subject,
    subtitle: res.from || '/',
  };
};

export {
  mapSearch,
};
