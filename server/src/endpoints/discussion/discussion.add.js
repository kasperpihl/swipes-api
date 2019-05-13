import { array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';
import update from 'src/utils/update';
import channelCreate from 'src/utils/channel/channelCreate';

const expectedInput = {
  title: string.min(1).require(),
  owned_by: string.require(),
  privacy: any.of('public', 'private'),
  members: array.of(string)
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
      title,
      members = [],
      owned_by,
      privacy = 'public'
    } = res.locals.input;

    const uniqueMembers = [...new Set(members).add(user_id)];
    const channel = channelCreate(
      owned_by,
      privacy,
      title,
      user_id,
      uniqueMembers
    );

    const [discussionRes] = await transaction([
      sqlInsertQuery('discussions', channel, {
        dontPrepare: { members: true }
      }),
      sqlPermissionInsertQuery(
        channel.discussion_id,
        privacy,
        owned_by,
        uniqueMembers
      )
    ]);

    res.locals.update = update.prepare(channel.discussion_id, [
      { type: 'discussion', data: discussionRes.rows[0] }
    ]);

    res.locals.output = {
      discussion_id: channel.discussion_id
    };
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
