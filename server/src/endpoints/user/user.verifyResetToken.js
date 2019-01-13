import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import tokenParse from 'src/utils/token/tokenParse';

const expectedInput = {
  resetToken: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res) => {
    const { resetToken } = res.locals.input;
    const parsedToken = tokenParse('sw-r', resetToken);
    const now = Math.floor(Date.now() / 1000);
    if (
      !parsedToken ||
      !parsedToken.tokenContent ||
      !parsedToken.tokenContent.exp ||
      (parsedToken.tokenContent && parsedToken.tokenContent.exp < now)
    ) {
      throw Error('Invalid reset token');
    }

    // Create response data.
    res.locals.output = {};
  }
);
