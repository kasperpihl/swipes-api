"use strict";

import config from 'config';
import express from 'express';
import r from 'rethinkdb';
import Promise from 'bluebird';
import shortid from 'shortid';
import hash from 'object-hash';
import db from '../db.js';
import SwipesError from '../swipes-error';

const createSwipesShortUrl = ({ userId, service }) => {
  const checksum = hash({ service, userId });
  const checkSumQ = r.table('links').getAll(checksum, {index: 'checksum'});

  let shortUrl = null;

  return db.rethinkQuery(checkSumQ)
    .then((res) => {
      if (res.length > 0) {
        shortUrl = res[0].short_url;

        return Promise.resolve();
      }

      shortUrl = shortid.generate();
      const link = {
        checksum: checksum,
        service: service,
        short_url: shortUrl,
        userId: userId
      };

      const insertLinkQ = r.table('links').insert(link);

      return db.rethinkQuery(insertLinkQ);
    })
    .then(() => {
      return Promise.resolve(shortUrl);
    })
    .catch((e) => {
      return Promise.reject(e);
    })
}

export {
  createSwipesShortUrl
}
