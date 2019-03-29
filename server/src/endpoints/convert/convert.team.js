import { string } from 'valjs';
import { getClient } from 'src/utils/db/db';
import convertClean from './convertClean';
import convertDiscussions from './convertDiscussions';
import convertFetchRethink from './convertFetchRethink';
import convertGoalsWithoutMilestone from './convertGoalsWithoutMilestone';
import convertContextAttachments from './convertContextAttachments';
import convertMiscDiscussion from './convertMiscDiscussion';
import convertMilestones from './convertMilestones';
import convertUsers from './convertUsers';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  team_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res, next) => {
    // Get inputs
    let { team_id } = res.locals.input;

    ////////////////////////
    // FETCHING FROM RETHINKDB
    ////////////////////////
    console.log('STARTING ' + team_id);

    const {
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
    } = await convertFetchRethink({ team_id });

    ////////////////////////
    // BEGINNING SQL QUERIES
    ////////////////////////
    const c = await getClient();

    team_id = idGenerate('T', 8, true);
    try {
      await convertClean({ c, team_id });
      await c.query('BEGIN');

      await convertUsers({ team, users, c });

      await convertMilestones({
        team_id,
        c,
        team,
        milestones,
        goalsById,
        filesById,
        notesById,
        commentsByDiscussionId,
        membersByDiscussionId,
        discussionsByContext
      });

      await convertGoalsWithoutMilestone({
        goalsNoMilestone,
        team_id,
        c,
        team,
        filesById,
        notesById,
        commentsByDiscussionId,
        membersByDiscussionId,
        discussionsByContext
      });

      await convertDiscussions({
        team_id,
        c,
        membersByDiscussionId,
        commentsByDiscussionId,
        discussions: discussionsWithoutContext,
        filesById,
        notesById
      });

      await convertContextAttachments({
        c,
        team,
        team_id,
        milestones,
        goalsById,
        discussionsByContext,
        commentsByDiscussionId,
        filesById,
        notesById
      });

      await convertMiscDiscussion({
        c,
        team,
        team_id,
        goalsNoMilestone,
        discussionsByContext,
        commentsByDiscussionId,
        filesById,
        notesById
      });

      await c.query('COMMIT');
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
  }
);
