const mapSearch = (res) => {
  const idParts = res.id.split('-');

  if (res.content_type === 'task') {
    let subtitle = '';

    if (res.folder) {
      subtitle = res.folder.join(', ');
    } else {
      subtitle = res.status;
    }
    if (res.to) {
      subtitle += `: ${res.to.join(', ')}`;
    }

    return {
      service: {
        type: 'task',
        id: idParts[idParts.length - 1],
        name: 'asana',
      },
      subtitle,
      title: res.title,
    };
  }

  return null;
};

export {
  mapSearch,
};
