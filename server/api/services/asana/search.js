const mapSearch = (res) => {
  const id = res.id.split(/-(.+)/)[1];

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
        id,
        type: 'task',
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
