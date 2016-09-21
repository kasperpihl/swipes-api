# Preview structure

## Asana task
```[
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
          subtitle: 'Assignee'
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
]```


## Dropbox file
```[
  
]```