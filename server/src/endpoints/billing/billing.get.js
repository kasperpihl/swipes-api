import { string } from 'valjs';
import stripeClient from 'src/utils/stripe/stripeClient';
import userTeamCheck from 'src/utils/userTeamCheck';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  team_id: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    // Get inputs
    const { user_id } = res.locals;
    const { team_id } = res.locals.input;

    // Ensure I have the rights to update billing.
    await userTeamCheck(user_id, team_id, {
      admin: true,
      status: 'active'
    });

    const teamRes = await query(
      `
        SELECT stripe_customer_id, stripe_subscription_id
        FROM teams
        WHERE team_id = $1
      `,
      [team_id]
    );
    const team = teamRes.rows[0];

    let customer;
    if (team.stripe_customer_id) {
      customer = await stripeClient.customers.retrieve(team.stripe_customer_id);
    }
    let subscription;
    if (team.stripe_subscription_id) {
      subscription = await stripeClient.subscriptions.retrieve(
        team.stripe_subscription_id
      );
    }

    res.locals.output = {
      customer,
      subscription
    };
  }
);
