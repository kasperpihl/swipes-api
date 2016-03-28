var React = require('react');

var UserAvatar = React.createClass({
  render: function () {
    user = this.props.user;

    if (!user.photo) {
      var name = user.name;
      var matches = name.match(/\b(\w)/g);
      var acronym = matches.join('');

      return (
        <div className="avatar-name">{acronym}</div>
      )
    } else {
      var image = user.photo.image_36x36;

      return (
        <img src={image} />
      )
    }
  }
})

module.exports = UserAvatar;
