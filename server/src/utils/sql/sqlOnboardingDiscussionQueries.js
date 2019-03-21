import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlToIsoString from 'src/utils/sql/sqlToIsoString';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';

export default function sqlOnboardingDiscussionQueries(organizationId, userId) {
  const discussions = ['General', 'Random'].map((title, i) => ({
    discussion_id: idGenerate('C-', 15),
    is_default: true,
    owned_by: organizationId,
    created_by: organizationId,
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
      sqlPermissionInsertQuery(d.discussion_id, 'public', organizationId)
    )
  ];
}
