const mapSearch = (res) => {
  const idParts = res.id.split('-');
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
    title,
    subtitle,
    type,
    id: idParts[idParts.length - 1],
  };
};

export {
  mapSearch,
};
