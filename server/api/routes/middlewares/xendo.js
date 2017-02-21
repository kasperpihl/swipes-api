import config from 'config';
import rp from 'request-promise';
import querystring from 'querystring';
import r from 'rethinkdb';
import {
  string,
  number,
  object,
} from 'valjs';
import {
  valLocals,
} from '../../utils';
import db from '../../../db';
import * as services from '../../services';

const xendoConfig = config.get('xendo');
const xendoUserCredentials = valLocals('xendoUserCredentials', {
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
  } = res.locals;
  const query = r.table('users').get(user_id);

  db.rethinkQuery(query)
    .then((result) => {
      if (!result) {
        return next('Invalid user_id :/');
      }

      setLocals({
        xendoUserCredentials: result.xendoCredentials,
      });

      return next();
    })
    .catch((error) => {
      return next(error);
    });
});
const xendoSearch = valLocals('xendoSearch', {
  xendoUserCredentials: object.require(),
}, (req, res, next, setLocals) => {
  const q = res.locals.q;
  const page_size = parseInt(res.locals.page_size, 10);
  const p = parseInt(res.locals.p, 10) || 0;
  const sources = (res.locals.sources || []).join(',');
  const {
    xendoUserCredentials,
  } = res.locals;
  const qo = {
    q,
    p,
  };

  if (sources.length > 0) {
    qo.sources = sources;
  }

  if (page_size > 0) {
    qo.page_size = page_size;
  }

  const qs = querystring.stringify(qo);

  const url = `${xendoConfig.searchEndpoint}?${qs}`;

  rp.get(url, {
    auth: {
      bearer: xendoUserCredentials.access_token,
    },
  })
  .then((result) => {
    setLocals({
      result: JSON.parse(result),
    });

    return next();
  })
  .catch((error) => {
    return next(error);
  });
});
const mapSourceToServiceName = (source) => {
  if (source === 'googledocs') {
    return 'drive';
  }

  return source;
};
const xendoSearchMapResults = valLocals('xendoSearchMapResults', {
  user_id: string.require(),
  result: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    result,
  } = res.locals;
  const xendoServicesQ =
    r.table('xendo_user_services')
      .getAll(user_id, { index: 'user_id' })
      .map((service) => {
        return [
          service('service_id').coerceTo('string'),
          service('service_account_id').coerceTo('string'),
        ];
      })
      .coerceTo('object');

  db.rethinkQuery(xendoServicesQ)
    .then((userServices) => {
      const mappedResults = result.response.docs.filter((doc) => {
        return userServices[doc.service_id] !== undefined;
      }).map((doc) => {
        const service = services[mapSourceToServiceName(doc.source)];
        let mappedDoc = {};

        if (service.mapSearch) {
          mappedDoc = service.mapSearch(doc);
        }

        const account_id = userServices[doc.service_id];

        return Object.assign({}, mappedDoc, {
          permission: {
            account_id,
          },
        });
      });

      setLocals({
        mappedResults,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const xendoSignUpQueueMessage = valLocals('xendoSignUpQueueMessage', {
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
  } = res.locals;
  const queueMessage = {
    user_id,
    event_type: 'xendo_user_signup',
  };

  setLocals({
    queueMessage,
    messageGroupId: 'xendo',
  });

  return next();
});
const xendoRemoveServiceFromUserQueueMessage = valLocals('xendoRemoveServiceFromUserQueueMessage', {
  user_id: string.require(),
  xendoUserServiceId: number.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    xendoUserServiceId,
  } = res.locals;
  const queueMessage = {
    user_id,
    xendo_user_service_id: xendoUserServiceId,
    event_type: 'xendo_remove_service_from_user',
  };

  setLocals({
    queueMessage,
    messageGroupId: 'xendo',
  });

  return next();
});
const xendoAddServiceToUserQueueMessage = valLocals('xendoAddServiceToUserQueueMessage', {
  user_id: string.require(),
  serviceToAppend: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    serviceToAppend,
  } = res.locals;
  const queueMessage = {
    user_id,
    service_to_append: serviceToAppend,
    event_type: 'xendo_add_service_to_user',
  };

  setLocals({
    queueMessage,
    messageGroupId: 'xendo',
  });

  return next();
});

export {
  xendoUserCredentials,
  xendoSearch,
  xendoSearchMapResults,
  xendoSignUpQueueMessage,
  xendoRemoveServiceFromUserQueueMessage,
  xendoAddServiceToUserQueueMessage,
};
