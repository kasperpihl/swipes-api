## Ping
- id
- created_by
- updated_at
- created_at
- sent_at
- receivers
- message
- attachments
- discussion_id (if turned into a discussion!)
- org_id

> A user should be able to:
- Turn a ping into a discussion (set a topic, and add ping as first comment.)

> Endpoints
- ping.send
- ping.markAsSeen

## PingReceiver
- ping_id
- received_by
- created_at
- updated_at
- sent_at
- thanks_at
- read_at
- org_id

## Discussion
- id
- topic (or title)
- permission (public or private)
- context (reference to some arbitrary)
- created_by
- created_at
- followers
- org_id

# Comment
- id
- discussion_id
- created_at
- created_by
- updated_at
- message
- attachments
- attachment_order
- org_id

> A user should be able to:
- Follow public/private discussions to let them pop up in the main feed of discussions. (and receive push)
- Change topic of a discussion
- Change privacy of a discussion
- Unfollow/Leave discussions
- Mute discussions I'm following to not show notification badges. (and push)
- Add participants to private discussions.
- See if someone leaves/joins/changes topic to a discussion (without notification)
- React to comments
- See a list discussions indicating which are unread.
- See an indicator which comments are new since last
- See if my comment is delivered.
- See who read my comment.