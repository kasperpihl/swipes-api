import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import randomstring from 'randomstring';
import idGenerate from 'src/utils/idGenerate';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';

export default async function convertDiscussions({
  team_id,
  c,
  discussions,
  followersByDiscussionId,
  commentsByDiscussionId,
  filesById,
  notesById
}) {
  const notesToInsert = [];
  const filesToInsert = [];

  console.log('CONVERTING DISCUSSIONS ' + discussions.length);
  for (let i = 0; i < discussions.length; i++) {
    const discussion = discussions[i];
    const comments = commentsByDiscussionId[discussion.id];
    const followers = followersByDiscussionId[discussion.id];
    if (!comments || !comments.length || !followers || !followers.length)
      return;
    const discussionId = idGenerate('C-', 15);
    await c.query(
      sqlInsertQuery(
        'discussions',
        {
          discussion_id: discussionId,
          owned_by: team_id,
          title: discussion.topic,
          last_comment: discussion.last_comment,
          last_comment_at: discussion.last_comment_at,
          last_comment_by: discussion.last_comment_by,
          created_by: discussion.created_by,
          followers: `jsonb_build_object(
                ${followers
                  .map(
                    f =>
                      `'${f.user_id}', '${new Date(f.read_at).toISOString()}'`
                  )
                  .join(', ')}
              )`
        },
        {
          dontPrepare: { followers: true }
        }
      )
    );
    await c.query(
      sqlPermissionInsertQuery(discussionId, 'public', team_id)
    );
    await c.query(
      sqlInsertQuery(
        'discussion_comments',
        comments.map(comment => {
          let attachments = null;
          if (comment.attachments && comment.attachments.length) {
            attachments = comment.attachments
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
          return {
            discussion_id: discussionId,
            comment_id: randomstring.generate(6),
            message: comment.message,
            sent_at: comment.sent_at,
            sent_by: comment.sent_by,
            attachments,
            reactions: JSON.stringify(comment.reactions),
            updated_at: comment.updated_at
          };
        })
      )
    );
    console.log('INSERTED DISCUSSION ' + discussionId);
  }

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
