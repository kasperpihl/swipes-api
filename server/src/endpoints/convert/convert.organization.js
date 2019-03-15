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
  organization_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res, next) => {
    // Get inputs
    const { organization_id } = res.locals.input;

    ////////////////////////
    // FETCHING FROM RETHINKDB
    ////////////////////////
    console.log('STARTING ' + organization_id);

    const {
      followersByDiscussionId,
      commentsByDiscussionId,
      discussionsByContext,
      discussionsWithoutContext,
      filesById,
      notesById,
      goalsById,
      milestones,
      goalsNoMilestone,
      org,
      users
    } = await convertFetchRethink({ organization_id });

    ////////////////////////
    // BEGINNING SQL QUERIES
    ////////////////////////
    const c = await getClient();

    try {
      await convertClean({ c, organization_id });
      await c.query('BEGIN');

      await convertUsers({ org, users, c });

      await convertMilestones({
        organization_id,
        c,
        org,
        milestones,
        goalsById,
        filesById,
        notesById,
        commentsByDiscussionId,
        followersByDiscussionId,
        discussionsByContext
      });

      await convertGoalsWithoutMilestone({
        goalsNoMilestone,
        organization_id,
        c,
        org,
        filesById,
        notesById,
        commentsByDiscussionId,
        followersByDiscussionId,
        discussionsByContext
      });

      await convertDiscussions({
        organization_id,
        c,
        followersByDiscussionId,
        commentsByDiscussionId,
        discussions: discussionsWithoutContext,
        filesById,
        notesById
      });

      await convertContextAttachments({
        c,
        org,
        organization_id,
        milestones,
        goalsById,
        discussionsByContext,
        commentsByDiscussionId,
        filesById,
        notesById
      });

      await convertMiscDiscussion({
        c,
        org,
        organization_id,
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
