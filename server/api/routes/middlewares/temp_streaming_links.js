import {
  string,
} from 'valjs';
import {
  dbGetSingleTempStreamingLink,
} from './db_utils/temp_streaming_links';
import {
  valLocals,
} from '../../utils';

const tempStreamingLinkGetSingle = valLocals('tempStreamingLinkGetSingle', {
  id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    id,
  } = res.locals;

  dbGetSingleTempStreamingLink({ id })
    .then((link) => {
      setLocals({
        service_name: link.service.name,
        account_id: link.permission.account_id,
        user_id: link.user_id,
        urlData: link,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export {
  tempStreamingLinkGetSingle,
};
