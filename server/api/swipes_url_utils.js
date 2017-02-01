import shortid from 'shortid';
import hash from 'object-hash';
import {
  createLink,
} from './routes/middlewares/db_utils/links';
import {
  createTempStreamingLink,
} from './routes/middlewares/db_utils/temp_streaming_links';
import {
  insertEvent,
} from './webhook_utils';

const createSwipesShortUrl = ({ link, shortUrlData, user_id, event }) => {
  const checksum = hash({ link });
  const insertDoc = Object.assign({}, { checksum }, shortUrlData);
  let meta = null;

  createLink({ meta, insertDoc })
    .then((result) => {
      const changes = result.changes[0];

      meta = changes.new_val.meta;

      insertEvent({
        user_id,
        eventData: Object.assign({}, event, { meta, checksum }),
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const createSwipesTempStreamUrl = (urlData) => {
  const id = shortid.generate();
  const insert_doc = Object.assign({}, { id }, urlData);

  return createTempStreamingLink({ insert_doc });
};

export {
  createSwipesShortUrl,
  createSwipesTempStreamUrl,
};
