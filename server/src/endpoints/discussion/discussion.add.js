import { array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import { transaction } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
const expectedInput = {
  topic: string.min(1).require(),
  owned_by: string.require(),
  privacy: any.of('public', 'private'),
  followers: array.of(string)
};

export default endpointCreate(
  {
    expectedInput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res) => {
    // Get inputs
    const { user_id } = res.locals;
    const {
      topic,
      followers = [],
      owned_by,
      privacy = 'public'
    } = res.locals.input;
    const discussionId = idGenerate('D', 15);

    const uniqueFollowers = [...new Set(followers).add(user_id)];

    const followerString = `jsonb_build_object(
      ${uniqueFollowers
        .map(uId => `'${uId}', ${uId === user_id ? 'now()' : 'n'}`)
        .join(', ')}
    )`;

    const permissionQuery = {
      text: `INSERT into permissions (permission_from, owned_by, granted_to) VALUES `,
      values: [discussionId, owned_by]
    };
    if (privacy === 'private') {
      permissionQuery.text += uniqueFollowers
        .map((uId, i) => `($1, $2, $${i + 1 + permissionQuery.values.length})`)
        .join(', ');
      permissionQuery.values = permissionQuery.values.concat(uniqueFollowers);
    } else {
      permissionQuery.text += '($1, $2, $3)';
      permissionQuery.values.push(owned_by);
    }

    const [discussionRes] = await transaction([
      sqlInsertQuery(
        'discussions',
        {
          discussion_id: discussionId,
          owned_by,
          topic,
          created_by: user_id,
          last_comment_by: user_id,
          last_comment: 'just created this discussion.',
          last_comment_at: 'now()',
          followers: followerString
        },
        {
          dontPrepare: { followers: true }
        }
      ),
      permissionQuery
    ]);

    res.locals.output = {
      // updates: [{ type: 'discussion', data: discussionRes.rows[0] }]
    };
  }
);
