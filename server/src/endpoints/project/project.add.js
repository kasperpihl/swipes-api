import r from 'rethinkdb';
import { array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {
  title: string.require(),
  privacy: any.of('public', 'private'),
  notifyPeople: array.of(string),
  organization_id: string.min(1).require(),
};

export default endpointCreate(
  {
    endpoint: '/project.add',
    expectedInput,
  },
  async (req, res, next) => {
    // Get inputs
    const { user_id } = res.locals;
    const { title, privacy, organization_id } = res.locals.input;

    const projectId = idGenerate('P', 15);

    const projectQuery = dbInsertQuery('projects', {
      organization_id,
      created_at: r.now(),
      id: projectId,
      title,
      created_by: user_id,
      privacy: privacy || 'public',
      archived: false,
    });

    const projectRes = await dbRunQuery(projectQuery);
    const project = projectRes.changes[0].new_val;

    // Create response data.
    res.locals.output = {
      updates: [{ type: 'project', data: project }],
    };
    res.locals.messageGroupId = project.id;
  }
).background(async (req, res) => {
  dbSendUpdates(res.locals);
});
