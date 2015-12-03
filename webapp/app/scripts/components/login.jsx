var React = require('react');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Login = React.createClass({
	mixins: [ Navigation ],
	getEl:function(name){
		return $(this.refs[name].getDOMNode());
	},
	onLogin: function(){
		email = this.getEl("email").val();
		password = this.getEl("password").val();
		var data = {
			email: email,
			password: password
		};
		var self = this;
		swipes._client.callSwipesApi({force:true, command:"users.login"}, data, function(res,error){
			console.log(res,error);
			if(res && res.ok){
				localStorage.setItem("swipes-token", res.token);
				self.transitionTo("/");
			}
			else
				alert("Login failed");
		});
		return;
	},
	render: function() {

		return (
			<div className="login">
				<div className="input-wrapper email" error-attribute="">
					<input ref="email" type="email" className="email borderless" placeholder="Enter your email" />
				</div>
				<div className="input-wrapper password" error-attribute="">
					<input ref="password" type="password" className="password borderless" placeholder="Enter your password" />
				</div>
				<input type="button" onClick={this.onLogin} value="SIGN IN" />
			</div>
		);
	}
});

module.exports = Login;
