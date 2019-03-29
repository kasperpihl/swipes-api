import dbRethinkQuery from 'src/utils/db/dbRethinkQuery';
import r from 'rethinkdb';

export default async function convertFetchRethink({ team_id }) {
  ////////////////////////
  // FETCHING FROM RETHINKDB
  ////////////////////////

  const team = await dbRethinkQuery(r.table('organizations').get(team_id));

  let users = await dbRethinkQuery(
    r
      .table('users')
      .getAll(r.args(team.active_users.concat(team.disabled_users)))
  );
  team.active_users = team.active_users.filter(
    userId => !!users.find(u => u.id === userId)
  );

  users = users.map(u => ({
    ...u,
    password: u.password || '1234'
  }));

  const milestones = await dbRethinkQuery(
    r.table('milestones').filter({ team_id })
  );
  const goalsNoMilestone = await dbRethinkQuery(
    r.table('goals').filter({ team_id, milestone_id: null })
  );

  const _rGoals = await dbRethinkQuery(r.table('goals').filter({ team_id }));

  const _rNotes = await dbRethinkQuery(r.table('notes').filter({ team_id }));
  const _rFiles = await dbRethinkQuery(r.table('files').filter({ team_id }));

  const _rDiscussions = await dbRethinkQuery(
    r.table('discussions').filter({ team_id })
  );
  const _rComments = await dbRethinkQuery(
    r.table('comments').filter({ team_id })
  );
  const _rFollowers = await dbRethinkQuery(
    r.table('discussion_followers').filter({ team_id })
  );

  const goalsById = {};
  _rGoals.forEach(g => (goalsById[g.id] = g));

  const notesById = {};
  _rNotes.forEach(n => {
    if (n.created_by && n.text) notesById[n.id] = n;
  });

  const filesById = {};
  _rFiles.forEach(f => (filesById[f.id] = f));

  const discussionsByContext = {};
  const discussionsWithoutContext = [];

  _rDiscussions.forEach(d => {
    // console.log(d);
    if (d.archived) return;
    const cId = d.context && d.context.id;
    if (cId) {
      if (!discussionsByContext[cId]) {
        discussionsByContext[cId] = [];
      }
      discussionsByContext[cId].push(d);
    } else {
      discussionsWithoutContext.push(d);
    }
  });

  const commentsByDiscussionId = {};
  _rComments.forEach(c => {
    if (!commentsByDiscussionId[c.discussion_id]) {
      commentsByDiscussionId[c.discussion_id] = [];
    }
    commentsByDiscussionId[c.discussion_id].push(c);
  });

  const membersByDiscussionId = {};
  _rFollowers.forEach(f => {
    if (!membersByDiscussionId[f.discussion_id]) {
      membersByDiscussionId[f.discussion_id] = [];
    }
    membersByDiscussionId[f.discussion_id].push(f);
  });

  console.log('FETCHED FROM RETHINKDB...');

  return {
    membersByDiscussionId,
    commentsByDiscussionId,
    discussionsByContext,
    discussionsWithoutContext,
    filesById,
    notesById,
    goalsById,
    milestones,
    goalsNoMilestone,
    team,
    users
  };
}
