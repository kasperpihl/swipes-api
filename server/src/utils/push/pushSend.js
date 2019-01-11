import config from 'config';
import request from 'request';
import valUtil from 'src/utils/val/valUtil';
import { object, string, array } from 'valjs';

const oneSignalConfig = config.get('onesignal');

export default valUtil(
  [
    object
      .as({
        users: array
          .min(1)
          .of(string)
          .require(),
        targetId: string.require(),
        targetType: string
      })
      .require(),
    object
      .as({
        content: string.require(),
        heading: string.require()
      })
      .require()
  ],
  (options, pushMessage) => {
    return new Promise((resolve, reject) => {
      const filters = [];

      options.users.forEach((userId, i) => {
        if (i > 0) {
          filters.push({
            operator: 'OR'
          });
        }

        filters.push({
          field: 'tag',
          key: 'swipesUserId',
          relation: '=',
          value: userId
        });
      });

      const message = {
        contents: { en: pushMessage.content },
        headings: { en: pushMessage.heading },
        filters,
        app_id: oneSignalConfig.appId,
        // contents: { en: history.message },
        // headings: { en: headingsMessage },
        // subtitle: { en: `about ${goal.title}` },
        data: {
          group_id: 'swipesAndroid',
          target_id: options.targetId,
          targetType: options.targetType || null
        },
        priority: 10,
        content_available: true,
        android_visibility: 0
      };

      const reqOptions = {
        url: 'https://onesignal.com/api/v1/notifications',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Basic ${oneSignalConfig.restKey}`
        },
        json: message
      };

      request.post(reqOptions, error => {
        if (error) {
          throw Error(error);
        }
        return resolve();
      });
    });
  }
);
