import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import randomstring from 'randomstring';
import idGenerate from 'src/utils/idGenerate';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';

export default async function convertMiscDiscussion({
  c,
  team,
  team_id,
  goalsNoMilestone,
  discussionsByContext,
  commentsByDiscussionId,
  filesById,
  notesById
}) {
  const notesToInsert = [];
  const filesToInsert = [];

  console.log('CONVERTING MISC DISCUSSION');

  const discussionId = idGenerate('C', 8, true);
  const discussion = {
    discussion_id: discussionId,
    title: 'Misc',
    owned_by: team_id,
    created_by: team_id,
    members: `jsonb_build_object(
        ${team.active_users
          .map(user_id => `'${user_id}', '${new Date().toISOString()}'`)
          .join(', ')}
          )`
  };
  let comments = [];
  const appendComments = dComments => {
    if (dComments && dComments.length) {
      comments = comments.concat(
        dComments.map(c => {
          let attachments = null;
          if (c.attachments && c.attachments.length) {
            attachments = c.attachments
              .map(a => {
                const type = a.link.service.type;
                let title = a.title || a.link.meta.title;
                const id = a.link.service.id;
                if (type === 'note') {
                  const note = notesById[id];
                  if (!note) {
                    return { type: 'none' };
                  }
                  if (note.title) title = note.title;
                  notesToInsert.push({
                    note_id: id,
                    owned_by: team_id,
                    rev: note.rev,
                    title,
                    created_at: note.created_at,
                    created_by: note.created_by,
                    updated_at: note.updated_at || note.created_at,
                    updated_by: note.updated_by || note.created_by,
                    text: JSON.stringify(note.text)
                  });
                  delete notesById[id];
                } else if (type === 'file') {
                  const file = filesById[id];
                  if (!file) {
                    return { type: 'none' };
                  }
                  filesToInsert.push({
                    file_id: id,
                    owned_by: team_id,
                    file_name: file.file_name,
                    s3_url: file.s3_url,
                    content_type: file.content_type,
                    created_at: file.created_at,
                    created_by: file.created_by
                  });
                  delete filesById[id];
                }
                return {
                  type,
                  title,
                  id
                };
              })
              .filter(({ type }) => ['note', 'file', 'url'].indexOf(type) > -1);

            attachments = JSON.stringify(attachments);
          }
          if (
            !discussion.last_comment_at ||
            c.sent_at > discussion.last_comment_at
          ) {
            discussion.last_comment_at = c.sent_at;
            discussion.last_comment = c.message.slice(0, 254);
            discussion.last_comment_by = c.sent_by;
          }
          return {
            discussion_id: discussionId,
            comment_id: randomstring.generate(6),
            message: c.message,
            sent_at: c.sent_at,
            sent_by: c.sent_by,
            attachments,
            reactions: JSON.stringify(c.reactions),
            updated_at: c.updated_at
          };
        })
      );
    }
  };
  const findAndAppend = contextId => {
    if (discussionsByContext[contextId]) {
      discussionsByContext[contextId].forEach(disc => {
        const dComments = commentsByDiscussionId[disc.id];
        appendComments(dComments);
      });
    }
  };
  goalsNoMilestone.forEach(goal => {
    if (goal.archived) return;
    const goalComments = goal.attachment_order.map(attId => {
      const att = goal.attachments[attId];
      if (!att.link) {
        return null;
      }
      findAndAppend(att.link.service.id);
      return {
        sent_at:
          att.created_at || goal.created_at || milestone.created_at || 'now()',
        sent_by: att.created_by || goal.created_by || milestone.created_by,
        updated_at:
          att.updated_at || goal.updated_at || milestone.updated_at || 'now()',
        message: `${goal.title} > ${att.title}`,
        reactions: {},
        attachments: [att]
      };
    });
    appendComments(goalComments.filter(c => !!c));
    findAndAppend(goal.id);
  });
  if (!comments.length) return;
  // console.log(comments);
  await c.query(
    sqlInsertQuery('discussions', discussion, {
      dontPrepare: { members: true }
    })
  );
  await c.query(sqlPermissionInsertQuery(discussionId, 'public', team_id));
  await c.query(sqlInsertQuery('discussion_comments', comments));
  console.log('INSERTED DISCUSSION ' + discussionId);

  if (filesToInsert.length) {
    await c.query(
      sqlInsertQuery('files', filesToInsert, { upsert: 'files_pkey' })
    );
    console.log('INSERTED FILES ' + filesToInsert.length);
  }

  if (notesToInsert.length) {
    await c.query(
      sqlInsertQuery('notes', notesToInsert, { upsert: 'notes_pkey' })
    );
    console.log('INSERTED NOTES ' + notesToInsert.length);
  }
}
