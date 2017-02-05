const mapSearch = (res) => {
  const id = res.id.split(/-(.+)/)[1];
  const type = res.content_type;
  let title = '';
  let subtitle = '';

  if (['image', 'file', 'document'].indexOf(type) > -1) {
    title = res.filename;
    subtitle = `From ${res.author}`;
  }
  if (type === 'message') {
    title = res.message;
    subtitle = res.folder.join(', ');
    subtitle += ` - ${res.author}`;
  }

  return {
    service: {
      id,
      type,
      name: 'slack',
    },
    title,
    subtitle,
  };
};

export {
  mapSearch,
};
