import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction } from 'src/utils/db/db';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';
import stripeUpdateQuantity from 'src/utils/stripe/stripeUpdateQuantity';

const expectedInput = {
  organization_id: string.require(),
  target_user_id: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { organization_id, target_user_id } = input;

    // Allow to disable your self (leave org)
    if (target_user_id !== user_id) {
      // Ensure I have the rights to disable users.
      await userOrganizationCheck(user_id, organization_id, {
        admin: true,
        status: 'active'
      });
    }

    // Check that target user exists and is not owner.
    await userOrganizationCheck(target_user_id, organization_id, {
      owner: false
    });

    // creating a new user from scratch
    await transaction([
      {
        text: `
          UPDATE organization_users
          SET
            status = 'disabled',
            admin = false
          WHERE organization_id = $1
          AND user_id = $2
        `,
        values: [organization_id, target_user_id]
      },
      {
        text: `
          DELETE FROM user_permissions
          WHERE permission_to = $1
          AND user_id = $2
        `,
        values: [organization_id, target_user_id]
      },
      {
        text: `
          DELETE FROM permissions
          WHERE owned_by = $1
          AND granted_to = $2
        `,
        values: [organization_id, target_user_id]
      }
    ]);

    res.locals.backgroundInput = {
      organization_id
    };
    // Create response data.
    res.locals.output = {};
  }
).background(async (req, res) => {
  const { organization_id } = res.locals.input;
  await stripeUpdateQuantity(organization_id);
});
