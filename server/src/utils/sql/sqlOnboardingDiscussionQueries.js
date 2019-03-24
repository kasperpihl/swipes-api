import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlToIsoString from 'src/utils/sql/sqlToIsoString';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';

export default function sqlOnboardingDiscussionQueries(teamId, userId) {
  const discussions = ['General', 'Random'].map((title, i) => ({
    discussion_id: idGenerate('C', 8, true),
    is_default: true,
    owned_by: teamId,
    created_by: teamId,
    title,
    last_comment_by: userId,
    last_comment: 'just created this discussion.',
    last_comment_at: 'now()',
    followers: `jsonb_build_object('${userId}', ${sqlToIsoString('now()')})`
  }));

  return [
    sqlInsertQuery('discussions', discussions, {
      dontPrepare: { followers: true }
    }),
    ...discussions.map(d =>
      sqlPermissionInsertQuery(d.discussion_id, 'public', teamId)
    )
  ];
}
