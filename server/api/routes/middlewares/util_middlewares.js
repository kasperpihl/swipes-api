import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';

const notificationCreateGroupId = valLocals('notificationCreateGroupId', {
}, (req, res, next, setLocals) => {
  const notificationGroupId = generateSlackLikeId('NO', 10);

  setLocals({
    notificationGroupId,
  });

  return next();
});

export {
  notificationCreateGroupId,
};
