var React = require("react");

var Enemy = React.createClass({

	handleClick: function() {
		this.props.getUnitInfo(this.props.unitProps);
		//attack upon enemy unit reduces action by 2 (or 1 if lower)
	},

	render: function() {
		//onClick should access info and select the unit
		return (
			<img
				className={this.props.responsive + " " + this.props.cursorImage}
				src={"assets/images/" + this.props.unitProps.image}
				width={this.props.unitWidth}
				height={this.props.unitHeight}
				alt={this.props.unitProps.name}
				id={this.props.id}
				onClick={this.handleClick}
			/>
		)
	}
});

module.exports = Enemy;