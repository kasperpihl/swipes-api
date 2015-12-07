var React = require('react');
var SearchModal = React.createClass({
	render: function(){
		return (
			<div className="search-modal">
				<div className="search-input-wrapper">
					<input type="text" placeholder="Search" id="main-search"/>
					<label htmlFor="main-search"> 
						<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
						</svg> 
					</label>
				</div>
				
				<div className="search-results-wrapper">
					<div className="results-list">
					
					<div className="result-wrapper">
						<div className="result-title">PEOPLE</div>
						<ul className="results-specific-list">
							
							<li className="result">
							<div className="icon">
								<i className="material-icons">person</i>
							</div>
							Stefan Vladimirov, CCO
							</li>
						</ul> 
						</div>
						
						<div className="result-wrapper">
							<div className="result-title">Emails</div>
							<ul className="results-specific-list">
								<li className="result">
									<div className="icon">
										<i className="material-icons">email</i>
									</div>
									Design specifications for email app
								</li>
								<li className="result">
									<div className="icon">
										<i className="material-icons">email</i>
									</div>
									Designer needed
								</li>
								<li className="result">
									<div className="icon">
										<i className="material-icons">email</i>
									</div>
									Create more content around design
								</li>
							</ul> 
						</div>
						
						<div className="result-wrapper">
							<div className="result-title">Messages</div>
							<ul className="results-specific-list">
								<li className="result">
								<div className="icon">
									<i className="material-icons">message</i>
								</div>
								We need to iterate on the design style</li>
								<li className="result">
								<div className="icon">
									<i className="material-icons">message</i>
								</div>
								Did you see the design I sent you?</li>
								<li className="result">
								<div className="icon">
									<i className="material-icons">message</i>
								</div>
								I like the new design</li>
								<li className="result">
								<div className="icon">
									<i className="material-icons">message</i>
								</div>
								Check this dribbble design</li>
							</ul> 
						</div>
						
						<div className="result-wrapper">
							<div className="result-title">Notes</div>
							<ul className="results-specific-list">
								<li className="result">
								<div className="icon">
									<i className="material-icons">view_headline</i>
								</div>
								Design brief</li>
								<li className="result">
								<div className="icon">
									<i className="material-icons">view_headline</i>
								</div>
								Material design findings</li>
							</ul> 
						</div>
						
						<div className="result-wrapper">
							<div className="result-title">Actions</div>
							<ul className="results-specific-list">
								<li className="result">
								<div className="icon">
									<i className="material-icons">fiber_manual_record</i>
								</div>
								Design brief</li>
								<li className="result">
								<div className="icon">
									<i className="material-icons">fiber_manual_record</i>
								</div>
								Material design findings</li>
							</ul> 
						</div>
						
					</div>
					<div className="result-preview"></div>
				</div>
			</div>
		);
	}
});

module.exports = SearchModal;