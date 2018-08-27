import r from 'rethinkdb';
import Promise from 'bluebird';
import idGenerate from '../../src/utils/idGenerate';
import shorten from '../../src/utils/shorten';
import mentionsClean from '../../src/utils/mentions/mentionsClean';
import dbRunQuery from '../../src/utils/db/dbRunQuery';

const dbConfig = {
  host: 'rethinkdb-staging6110.cloudapp.net',
  port: 28015,
  db: 'swipes',
  user: 'swipes',
  password: 'sw1py@staging',
};

if (!dbConfig) {
  console.log('Don\'t you need the live config here?!?!');

  process.exit();
}

const pageItems = 500;
let item = 0;
let offset = 500;
const promises = [];

console.log('Picking information!');

const pagination = (resolve, reject) => {
  const posts = r.table('posts').orderBy('created_at').slice(item, offset);

  dbRunQuery(posts, { dbConfig })
    .then((results) => {
      if (results.length > 0) {
        item += pageItems;
        offset += pageItems;

        const discussions = results.map((row) => {
          const discussionId = idGenerate('D', 15);
          const followers = [];
          const comments = [];

          // FOLLOWERS
          row.followers.forEach((userId) => {
            followers.push({
              id: `${discussionId}-${userId}`,
              user_id: userId,
              discussion_id: discussionId,
              read_at: r.now(),
              organization_id: row.organization_id,
            });
          });

          // COMMENTS
          // First comment is the old post message
          comments.push({
            id: `${discussionId}-${idGenerate('C', 7)}`,
            message: row.message,
            discussion_id: discussionId,
            sent_at: row.created_at,
            attachments: row.attachments || [],
            reactions: row.reactions.map((r) => {
              return { [r.created_by]: r.reaction };
            }),
            sent_by: row.created_by,
            organization_id: row.organization_id,
            updated_at: row.updated_at,
          });

          // OTHER COMMENTS
          if (row.comments) {
            Object.keys(row.comments).forEach((key) => {
              const comment = row.comments[key];

              comments.push({
                id: `${discussionId}-${idGenerate('C', 7)}`,
                message: comment.message,
                discussion_id: discussionId,
                sent_at: comment.created_at,
                attachments: comment.attachments || [],
                reactions: comment.reactions.map((r) => {
                  return { [r.created_by]: r.reaction };
                }),
                sent_by: comment.created_by,
                organization_id: row.organization_id,
                updated_at: comment.updated_at,
              });
            });
          }

          // We need the last comment
          comments.sort((a, b) => {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.sent_at) - new Date(b.sent_at);
          });

          const lastCommentInfo = {};
          const lastComment = comments[comments.length - 1];

          lastCommentInfo.last_comment = mentionsClean(lastComment.message).slice(0, 100);
          lastCommentInfo.last_comment_at = lastComment.sent_at;
          lastCommentInfo.last_comment_by = lastComment.sent_by;

          const followersQ = r.table('discussion_followers').insert(followers);
          const commentsQ = r.table('comments').insert(comments);

          promises.push(
            dbRunQuery(followersQ, { dbConfig }),
            dbRunQuery(commentsQ, { dbConfig }),
          );

          // DISCUSSION
          return {
            archived: row.archived,
            context: row.context,
            created_by: row.created_by,
            id: discussionId,
            organization_id: row.organization_id,
            privacy: 'public',
            topic: shorten(mentionsClean(row.message), 60),
            topic_set: false,
            updated_at: row.updated_at,
            ...lastCommentInfo,
          };
        });

        const discussionsQ = r.table('discussions').insert(discussions);

        promises.push(dbRunQuery(discussionsQ, { dbConfig }));

        return pagination(resolve, reject);
      }

      return resolve();
    })
    .catch((error) => {
      return reject(error);
    });
};

console.log('Running queries');

const wrapperPromise = () => new Promise((resolve, reject) => {
  pagination(resolve, reject);
});

wrapperPromise()
  .then(() => {
    console.log('Waiting for queries to execute');
    return Promise.all(promises);
  })
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit();
  });
