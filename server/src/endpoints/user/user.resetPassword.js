import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import tokenParse from 'src/utils/token/tokenParse';
import { query } from 'src/utils/db/db';

const expectedInput = {
  resetToken: string.require(),
  password: string.min(1).require()
};

export default endpointCreate(
  {
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res) => {
    const { resetToken, password } = res.locals.input;
    const parsedToken = tokenParse('sw-r', resetToken);
    const now = Math.floor(Date.now() / 1000);
    if (
      !parsedToken ||
      !parsedToken.tokenContent ||
      !parsedToken.tokenContent.iss ||
      !parsedToken.tokenContent.exp ||
      (parsedToken.tokenContent && parsedToken.tokenContent.exp < now)
    ) {
      throw Error('Invalid reset token');
    }

    const passwordSha1 = sha1(password);

    await query(
      `
        UPDATE users
        SET
          password = $1,
          updated_at = now()
        WHERE user_id = $2
      `,
      [passwordSha1, parsedToken.tokenContent.iss]
    );
    // Create response data.
    res.locals.output = {};
  }
);
