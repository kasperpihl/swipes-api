import { query, transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
const expectedInput = {};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    const teamRes = await query(`
      SELECT team_id FROM teams
    `);
    for (let i = 0; i < teamRes.rows.length; i++) {
      const oldTeamId = teamRes.rows[i].team_id;
      console.log(oldTeamId);
      if (oldTeamId.startsWith('O')) {
        const newTeamId = idGenerate('T', 8, true);
        console.log('converting', oldTeamId, '>>>>>', newTeamId);
        const conversions = [
          ['discussions', 'owned_by'],
          ['files', 'owned_by'],
          ['jobs', 'owned_by'],
          ['notes', 'owned_by'],
          ['planning_tasks', 'owned_by'],
          ['projects', 'owned_by'],
          ['permissions', 'owned_by'],
          ['permissions', 'granted_to'],
          ['teams', 'team_id']
        ];
        await transaction(
          conversions.map(([table, key]) => ({
            text: `
              UPDATE ${table}
              SET ${key} = $1
              WHERE ${key} = $2
            `,
            values: [newTeamId, oldTeamId]
          }))
        );
      }
    }
    const commentRes = await query(`
      SELECT comment_id from discussion_comments 
    `);

    for (let i = 0; i < commentRes.rows.length; i++) {
      const oldCommentId = commentRes.rows[i].comment_id;
      if (oldCommentId.startsWith('MES-')) {
        const newCommentId = idGenerate(6);
        console.log('converting', oldCommentId, '>>>>>', newCommentId);
        const conversions = [['discussion_comments', 'comment_id']];
        await transaction(
          conversions.map(([table, key]) => ({
            text: `
              UPDATE ${table}
              SET ${key} = $1
              WHERE ${key} = $2
            `,
            values: [newCommentId, oldCommentId]
          }))
        );
      }
    }
  }
);
