import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import emailResetPassword from 'src/utils/email/emailResetPassword';
import tokenCreate from 'src/utils/token/tokenCreate';

const expectedInput = {
  email: string.format('email').require()
};

export default endpointCreate(
  {
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res) => {
    const { email } = res.locals.input;
    const userRes = await query(
      `
        SELECT user_id, profile, email
        FROM users 
        WHERE email = $1
      `,
      [email]
    );

    const user = userRes.rows[0];

    if (user && user.user_id) {
      const resetToken = tokenCreate({
        iss: user.user_id,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
      });
      res.locals.backgroundInput = {
        email: user.email,
        firstName: user.profile.first_name,
        resetToken
      };
    }

    // Create response data.
    res.locals.output = {};
  }
).background(async (req, res) => {
  const { email, firstName, resetToken } = res.locals.input;
  if (email) {
    await emailResetPassword(email, firstName, resetToken);
  }
});
