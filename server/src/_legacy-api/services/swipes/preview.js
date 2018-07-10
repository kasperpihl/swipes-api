import {
  dbFilesGetSingle,
} from '../../routes/middlewares/db_utils/files';

const elementsData = (title) => {
  return {
    header: {
      title,
    },
  };
};
const fileData = (content_type, url) => {
  const file = {
    content_type,
    url,
  };

  return file;
};
const buttonsData = (title, url) => {
  const buttons = [
    {
      icon: 'Earth',
      title: 'Open in browser',
      url,
      force_external: true,
    },
    {
      icon: 'Download',
      title: 'Download',
      url,
      force_download: title,
    },
  ];

  return buttons;
};
const preview = ({ auth_data, type, itemId, user }, callback) => {
  if (type === 'file') {
    return dbFilesGetSingle({ id: itemId })
      .then((file) => {
        const url = file.s3_url;
        const mapElements = elementsData(file.file_name);
        const mapFile = fileData(file.content_type, url);
        const mapButtons = buttonsData(file.file_name, url);

        return callback(null, {
          buttons: mapButtons,
          file: mapFile,
          ...mapElements,
        });
      })
      .catch((err) => {
        return callback(err);
      });
  }

  return callback(`Type "${type}" is not supported :/`);
};

export {
  preview,
};