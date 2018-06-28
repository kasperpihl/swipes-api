import {
  string,
} from 'valjs';
import {
  dbTokensGetByUserId,
  dbTokensRevoke,
} from './db_utils/tokens';
import {
  valLocals,
  parseToken,
} from '../../utils';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const tokensGetByUserId = valLocals('tokensGetByUserId', {
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
  } = res.locals;

  dbTokensGetByUserId({ user_id })
    .then((tokens) => {
      setLocals({
        tokens,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const tokensRevoke = valLocals('tokensRevoke', {
  user_id: string.require(),
  token_to_revoke: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    token_to_revoke,
  } = res.locals;

  const parsedToken = parseToken(token_to_revoke);

  if (user_id !== parsedToken.content.iss) {
    return next(new SwipesError('not_permitted'));
  }

  return dbTokensRevoke({ user_id, token: parsedToken.dbToken })
    .then(() => {
      setLocals({
        token_to_revoke,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const tokensRevokeQueueMessage = valLocals('tokensRevokeQueueMessage', {
  user_id: string.require(),
  token_to_revoke: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    token_to_revoke,
  } = res.locals;
  const queueMessage = {
    user_id,
    token_to_revoke,
    event_type: 'token_revoked',
  };

  setLocals({
    queueMessage,
    messageGroupId: user_id,
  });

  return next();
});

export {
  tokensGetByUserId,
  tokensRevoke,
  tokensRevokeQueueMessage,
};
