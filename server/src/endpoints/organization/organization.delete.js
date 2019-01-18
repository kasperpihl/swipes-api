import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction } from 'src/utils/db/db';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';
import stripeCancelSubscription from 'src/utils/stripe/stripeCancelSubscription';

const expectedInput = {
  organization_id: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { organization_id } = input;

    // Ensure I have the rights to delete organization.
    await userOrganizationCheck(user_id, organization_id, {
      owner: true
    });

    await stripeCancelSubscription(organization_id);

    // creating a new user from scratch
    await transaction([
      {
        text: `
          DELETE FROM organizations
          WHERE organization_id = $1
        `,
        values: [organization_id]
      },
      {
        text: `
          DELETE FROM projects
          WHERE owned_by = $1
        `,
        values: [organization_id]
      },
      {
        text: `
          DELETE FROM discussions
          WHERE owned_by = $1
        `,
        values: [organization_id]
      },
      {
        text: `
          DELETE FROM permissions
          WHERE owned_by = $1
        `,
        values: [organization_id]
      },
      {
        text: `
          DELETE FROM user_permissions
          WHERE permission_to = $1
        `,
        values: [organization_id]
      }
    ]);

    // Create response data.
    res.locals.output = {};
  }
);
