const mapSearch = (res) => {
  const type = res.content_type;
  let id = '';
  let title = '';
  let subtitle = '';

  if (['image', 'file', 'document', 'video'].indexOf(type) > -1) {
    const idParts = res.id.split('-');

    id = idParts[idParts.length - 1];
    title = res.filename;
    subtitle = `From ${res.author}`;
  }
  if (type === 'message') {
    const idParts = res.id.split('-');

    id = idParts[idParts.length - 1];
    title = res.message;
    subtitle = res.folder.join(', ');
    subtitle += ` - ${res.author}`;
  }

  return {
    service: {
      id,
      type,
      content_type: res.source_content_type,
      name: 'slack',
    },
    title,
    subtitle,
  };
};

export {
  mapSearch,
};
