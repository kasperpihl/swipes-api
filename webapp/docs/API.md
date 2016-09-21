# Preview structure

## CardList supported props
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
]
```


## Dropbox file
```
[
  {
    type: 'Card',
    data: {
      title: ''
    }
  }
]
```