export default function sqlOnboardingDiscussionQueries(organizationId, userId) {
  const generalTitle = 'General';
  const randomTitle = 'Random';
  const discussions = [generalTitle, randomTitle].map((title, i) => ({
    discussion_id: idGenerate('C-', 15),
    is_default: true,
    owned_by: organizationId,
    created_by: organizationId,
    title,
    last_comment_by: userId,
    last_comment: 'just created this discussion.',
    last_comment_at: 'now()',
    followers: JSON.stringify({
      [userId]: 'n'
    })
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
