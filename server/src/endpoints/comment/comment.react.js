import r from 'rethinkdb';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import mentionsMultiString from 'src/utils/mentions/mentionsMultiString';
import mentionsClean from 'src/utils/mentions/mentionsClean';
import dbSendNotifications from 'src/utils/db/dbSendNotifications';
import dbClearNotifications from 'src/utils/db/dbClearNotifications';

const expectedInput = {
  comment_id: string.require(),
  reaction: string,
};

export default endpointCreate({
  endpoint: '/comment.react',
  expectedInput,
}, async (req, res) => {
  // Get inputs
  const { user_id, organization_id } = res.locals;
  const {
    comment_id,
    reaction,
  } = res.locals.input;

  const q = dbUpdateQuery('comments', comment_id, {
    reactions: {
      [user_id]: reaction ? reaction : r.literal()
    }
  });

  const commentRes = await dbRunQuery(q);

  // Create response data.
  res.locals.output = {
    updates: [
      {
        type: 'comment',
        data: commentRes.changes[0].new_val,
      }
    ]
  };
}).background(async (req, res) => {
  dbSendUpdates(res.locals);

  const { organization_id, user_id } = res.locals;
  const comment = res.locals.output.updates[0].data;

  const reactionists = Object.keys(comment.reactions);

  if(!reactionists.length) {
    dbClearNotifications(`${comment.sent_by}-${comment.id}-reaction`);
  } else {
    const mentionString = mentionsMultiString(reactionists, {
      number: 2,
      preferId: user_id,
    });

    dbSendNotifications({
      id: `${comment.sent_by}-${comment.id}-reaction`,
      user_id: comment.sent_by,
      organization_id,
      title: `${mentionString} loved your comment: ${mentionsClean(comment.message).slice(0, 60)}...`,
      done_by: [user_id].concat(reactionists.filter(u => u !== user_id)),
      target: {
        id: comment.discussion_id,
        item_id: comment.id,
      },
    });
  }

  
});
