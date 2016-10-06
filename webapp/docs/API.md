# Endpoints
## Yesterday
goals.add
goals.list


step.assign
step.do
- goal_id
- type
- payload
/* 
Fetch the goal
Check current step
Compare current step type to sent type
Forward payload to handler type
*/
step.complete



## Later
goals.update
goals.remove
step.removeAssignee
step.add
step.update
step.remove


# Socket events
## Yesterday
goal_created (goal.add)
goal_changed (step.complete)
goal_deleted (goal.delete)
step_changed (step.do)

# IDs

A - Apps
G - Goals
O - Organisation
S - Service / Integration / Provider /
T - Team
U - User
W - Workflow

# Preview structure

## Card supported props
The supported properties to be sent with the Swipes Card
```
propTypes = {
  data: shape({
    id: stringOrNum,
    shortUrl: string,
    title: string,
    subtitle: string,
    description: string,
    headerImage: string,
    preview: shape({
      type: oneOf(['html', 'image']).isRequired,
      url: string,
      html: string,
      width: stringOrNum,
      height: stringOrNum
    }),
    actions: arrayOf(PropTypes.shape({
      label: string.isRequired,
      icon: string,
      bgColor: string
    }))
  })
}
```

## CardList supported props
The supported properties to be sent with a Swipes Card List
```
propTypes = {
  data: oneOfType([
    shape(tabProps),
    arrayOf(shape(tabProps))
  ]).isRequired,
}

tabProps = {
  title: string.isRequired,
  items: arrayOf(item),
  titleLeftImage: string,
  titleRightImage: string
};

item = {
  callDelegate: func.isRequired,
  data: shape({
    id: stringOrNum,
    shortUrl: string,
    title: string,
    subtitle: string,
    description: string,
    headerImage: string,
    actions: arrayOf(PropTypes.shape({
      label: string.isRequired,
      icon: string,
      bgColor: string
    }))
  })
}

```


## Asana task
```
[
  { type: 'Card',
    data: {
      title: 'Task title',
      subtitle: 'Project name',
      description: 'Task description',
      headerImage: 'profile picture of assigned', 
    }
  },
  {
    type: 'CardList',
    data: [
      {
        title: 'Subtasks',
        items: [{
          title: 'Task title',
          subtitle: 'Assignee',
          actions: [{ 
            label: "Complete/Undo"
          }]
        }]
      },
      {
        title: 'Comments',
        items: [{
          title: 'Comment string',
          subtitle: 'Author string / time ago.'
        }]
      }
    ]
  }
]
```


## Dropbox file
```
[
  {
    type: 'Card',
    data: {
      title: 'File title',
      subtitle: '/Path',
      headerImage: 'Type icon (document) etc', // Do this if preview is not image
      preview: { // If preview is image, do this
        type: 'image',
        url: 'imageUrl',
        width: imageWidthPx
        height: imageHeightPx
      },
      actions: [{
        label: 'Download',
      },{
        label: 'Open'
      }]
    }
  }
]
```