import hash from 'object-hash';
import {
  createLink,
} from './routes/middlewares/db_utils/links';
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

export default createSwipesShortUrl;
