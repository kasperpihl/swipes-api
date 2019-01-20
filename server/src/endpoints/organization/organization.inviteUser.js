import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import userOrganizationCheck from 'src/utils/userOrganizationCheck';
import tokenCreate from 'src/utils/token/tokenCreate';
import tokenParse from 'src/utils/token/tokenParse';
import emailInviteUser from 'src/utils/email/emailInviteUser';

const expectedInput = {
  organization_id: string.require(),
  target_email: string.format('email').require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { organization_id, target_email } = input;

    // Ensure I have the rights to invite users.
    await userOrganizationCheck(user_id, organization_id, {
      status: 'active'
    });

    const orgRes = await query(
      `
        SELECT ou.status, o.name, o.pending_users, u.user_id, iu.email as inviter_email, iu.first_name as inviter_first_name
        FROM organizations o
        LEFT JOIN users u
        ON email = $1
        LEFT JOIN users iu
        ON iu.user_id = $2
        LEFT JOIN organization_users ou
        ON ou.user_id = u.user_id
        AND ou.organization_id = o.organization_id
        WHERE o.organization_id = $3
      `,
      [target_email, user_id, organization_id]
    );

    const org = orgRes.rows[0];
    if (org.status === 'active') {
      throw Error('already_part_of_org').toClient('Already in organization');
    }

    const lastSent = org.pending_users[target_email];
    // Only send an invitation email every 24 hours at max.
    if (lastSent && lastSent + 24 * 60 * 60 > Math.floor(Date.now() / 1000)) {
      throw Error('too_soon');
    }

    const inviteToken = tokenCreate('sw-i', {
      iss: user_id,
      aud: target_email,
      sub: organization_id,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    });

    const now = Math.floor(Date.now() / 1000);
    await query(
      `
          UPDATE organizations
          SET pending_users = pending_users || jsonb_build_object('${target_email}', ${now})
          WHERE organization_id = $1
        `,
      [organization_id]
    );

    res.locals.backgroundInput = {
      email: target_email,
      inviteToken,
      organizationName: org.name,
      inviterFirstName: org.inviter_first_name,
      inviterEmail: org.inviter_email
    };

    // Create response data.
    res.locals.output = {};
  }
).background(async (req, res) => {
  const {
    email,
    inviteToken,
    organizationName,
    inviterFirstName,
    inviterEmail
  } = res.locals.input;

  if (email) {
    await emailInviteUser(
      email,
      inviteToken,
      organizationName,
      inviterFirstName || inviterEmail
    );
  }
});
