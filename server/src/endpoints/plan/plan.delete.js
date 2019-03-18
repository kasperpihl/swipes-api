import { string } from 'valjs';
import { transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';

const expectedInput = {
  plan_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'plan_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { plan_id } = res.locals.input;

    await transaction([
      {
        text: `
          DELETE from plans
          WHERE plan_id = $1
        `,
        values: [plan_id]
      },
      {
        text: `
          DELETE from permissions
          WHERE permission_from = $1
        `,
        values: [plan_id]
      }
    ]);

    res.locals.update = update.prepare(plan_id, [
      {
        type: 'plan',
        data: {
          plan_id,
          deleted: true
        }
      }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
