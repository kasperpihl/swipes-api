"use strict";

import {
  request,
  shareRequest
} from './request';
import {
	createSwipesShortUrl
} from '../../swipes_url_utils.js';
import {
	updateCursors
} from '../../webhook_utils.js';

const processChanges = ({account, result}) => {
	const entries = result.entries;
	// Care only for .tag 'file' just for simplicity
	const filteredEntries = entries.filter((entry) => {
		return entry['.tag'] === 'file' && entry.sharing_info;
	});

	filteredEntries.forEach((entry) => {
		processFileChange({account, entry});
	})
}

const processFileChange = ({ account, entry }) => {
  const {
    auth_data,
    id,
    user_id
  } = account;

	// Get which user modified the file
	const getAccountMethod = 'users.getAccount';
	const getAccountParams = {
		account_id: entry.sharing_info.modified_by
	}

	request({auth_data, method: getAccountMethod, params: getAccountParams}, (err, res) => {
		if (err) {
			console.log(err);
			return;
		};

		const user = res;
		const sameUser = id === user.account_id;
		const userName = sameUser ? 'You' : user.name.display_name || user.email;
		const message = userName + ' made a change';

    const options = {
      auth_data,
      type: 'file',
      itemId: entry.id,
      user: {
        id: user_id
      }
    };

    shareRequest(options, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }

      const shortUrlData = res;
      const link = {
  			service: 'dropbox',
  			type: 'file',
  			id: entry.id
  		};
      const event = {
      	service: 'dropbox',
      	message: message,
      	account_id: id,
      	me: sameUser
      }

  		createSwipesShortUrl({ link, shortUrlData, user_id, event});
    })
	})
}

const webhooks = (account, callback) => {
  const {
    auth_data,
    id,
    user_id,
    cursors
  } = account;
  const method = 'files.listFolder.continue';

  if (!cursors || !cursors.list_folder_cursor) {
    return callback('The required cursor is missing. Try reauthorize the service to fix the problem.');
  }

  const params = {
    cursor: cursors.list_folder_cursor
  };

  const secondCallback = (error, result) => {
    if (error) {
      return console.log(error);
    }

    const cursor = result.cursor;

    processChanges({ account, result });

    // Repeat until there is no more pages
    if (result.has_more) {
      Object.assign(params, {cursor});

      request({auth_data, method, params}, secondCallback);
    } else {
      const cursors = {list_folder_cursor: cursor};
      updateCursors({ user_id, id, cursors });
    }
  }

  request({auth_data, method, params}, secondCallback);
}

export {
  webhooks
}
