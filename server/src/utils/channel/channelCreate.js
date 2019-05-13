import sqlToIsoString from 'src/utils/sql/sqlToIsoString';
import idGenerate from 'src/utils/idGenerate';

export default function channelCreate(
  owned_by,
  privacy,
  title,
  user_id,
  members
) {
  const discussionId = idGenerate('C', 8, true);

  const memberString = `jsonb_build_object(
    ${members
      .map(
        uId => `'${uId}', ${uId === user_id ? sqlToIsoString('now()') : "'n'"}`
      )
      .join(', ')}
  )`;

  return {
    discussion_id: discussionId,
    owned_by,
    title,
    created_by: user_id,
    last_comment_by: user_id,
    last_comment: 'just created this discussion.',
    last_comment_at: 'now()',
    privacy,
    members: memberString
  };
}
