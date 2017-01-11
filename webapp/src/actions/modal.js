import * as types from 'constants';

export function load(type, props, callback) {
  // support shorthand for load({title: 'lala'}, () => {})
  // passing without a type :)
  if (typeof props === 'function') {
    callback = props;
    props = null;
  }
  if (typeof type === 'object') {
    props = type;
    type = null;
  }

  return { type: types.LOAD_MODAL, modalType: type, props, callback };
}

export function hide() {
  return { type: types.HIDE_MODAL };
}

export function assign(assignees, callback) {
  return (dispatch, getState) => {
    const users = getState().get('users');
    const icon = {
      element: 'Person',
      props: { fill: '#3394FF' },
    };
    const userArray = users.toArray();
    const mappedUserArray = userArray.map(u => ({
      title: u.get('name'),
      img: u.get('profile_pic') || icon,
      selected: assignees.contains(u.get('id')),
    }));

    dispatch(load({
      title: 'Assign Person',
      data: {
        list: {
          selectable: true,
          multiple: true,
          items: mappedUserArray,
          emptyText: 'No people found',
        },
        buttons: ['Cancel', 'Select'],
      },
    }, (res) => {
      if (res && res.button) {
        callback(res.items.map(i => userArray[i].get('id')));
      } else {
        callback();
      }
    }));
  };
}
