var React = require('react');
var AlertModal = React.createClass({
  didClickButton: function(button){
    this.props.data.callback({button: button});
  },
  defaults: {
    title: "Alert",
    buttons: [],

  },
  render: function () {
    var options = this.props.data.options;

    var title = options.title || this.defaults.title;
    options.buttons = options.buttons || this.defaults.buttons;
    var buttons = options.buttons.map((button, i) => {
      if(typeof button === 'string'){
        button = {title: button};
      }
      if(typeof button != 'object')
        return false;
      button.key = i;
      return <AlertModal.Button didClickButton={this.didClickButton} key={i} data={button} />
    });
    var message = "";
    if(options.message){
      message = <div className="message">{options.message}</div>;
    }
    return (
      <div className="modal-full">
        <h2>{title}</h2>
        {message}
        <div className="buttons">
          {buttons}
        </div>
      </div>
    );
  }
});
AlertModal.Button = React.createClass({
  onClick: function(){
    this.props.didClickButton(this.props.data.key);
  },
  defaults: {
    title: "Submit"
  },
  render: function(){
    var data = this.props.data;

    var title = data.title || this.defaults.title;
    return (
      <button onClick={this.onClick}>{title}</button>
    );
  }
})

module.exports = AlertModal;