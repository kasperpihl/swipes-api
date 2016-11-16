"use strict";

import hash from 'object-hash';
import {
  createLink
} from './routes/middlewares/db_utils/links';
import {
  insertEvent
} from './webhook_utils.js';

const createSwipesShortUrl = ({ link, shortUrlData, userId, event }) => {
  const checksum = hash({ link });
  const meta = null;
  const insert_doc = Object.assign({}, { checksum }, shortUrlData);

  createLink({ meta, insert_doc })
    .then((result) => {
      const changes = result.changes[0];
      const meta = changes.new_val.meta;

      insertEvent({
        userId,
        eventData: Object.assign({}, event, { meta, checksum })
      });
    })
    .catch((error) => {
      console.log(error);
    })
}

export {
  createSwipesShortUrl
}
