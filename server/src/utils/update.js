import { query } from 'src/utils/db/db';
import randomstring from 'randomstring';
import redisPublish from 'src/utils/redis/redisPublish';

export default {
  prepare: (permissionId, rows) => ({
    update_id: randomstring.generate(8),
    permission_id: permissionId,
    rows
  }),
  send: async update => {
    let receivers = update.permission_id;
    if (
      typeof receivers === 'string' &&
      !(receivers.startsWith('U') || receivers.startsWith('T'))
    ) {
      const receiverRes = await query(
        `
        SELECT granted_to
        FROM permissions
        WHERE permission_from = $1
      `,
        [update.permission_id]
      );

      if (!receiverRes.rows.length) {
        throw Error('Not found')
          .code(404)
          .toClient();
      }
      receivers = receiverRes.rows.map(r => r.granted_to);
    } else if (!Array.isArray(receivers)) {
      receivers = [receivers];
    }

    for (let i = 0; i < receivers.length; i++) {
      await redisPublish(receivers[i], { type: 'update', payload: update });
    }
  }
};
