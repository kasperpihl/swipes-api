import { transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';
import update from 'src/utils/update';
import { string, array, any } from 'valjs';

const expectedInput = {
  owned_by: string.require(),
  title: string,
  privacy: any.of('public', 'private'),
  members: array.of(string)
};

export default endpointCreate(
  {
    expectedInput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res) => {
    const { user_id } = res.locals;
    const {
      title = null,
      owned_by,
      members = [],
      privacy = 'public'
    } = res.locals.input;

    const planId = idGenerate('PLAN-', 8);

    const userIds = [...new Set(members).add(user_id)];
    const d = new Date();
    // Setting date to monday (today if monday, or next monday).
    d.setDate(d.getDate() + ((((7 - d.getDay()) % 7) + 1) % 7));
    const startDate = d.toISOString().slice(0, 10);
    // Setting end date to be friday.
    d.setDate(d.getDate() + 4);
    const endDate = d.toISOString().slice(0, 10);

    const [planRes] = await transaction([
      sqlInsertQuery('plans', {
        owned_by,
        title,
        plan_id: planId,
        start_date: startDate,
        end_date: endDate,
        created_by: user_id
      }),
      sqlPermissionInsertQuery(planId, privacy, owned_by, userIds)
    ]);

    res.locals.update = update.prepare(planId, [
      { type: 'plan', data: planRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
