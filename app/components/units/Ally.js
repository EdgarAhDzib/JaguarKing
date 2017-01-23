var React = require("react");

var Ally = React.createClass({

	getInitialState: function() {
		return {
			xPos: this.props.unitProps.initX,
			yPos: this.props.unitProps.initY,
		}
	},

	handleClick: function() {
		this.props.getUnitInfo(this.props.unitProps);
		this.props.emptySquare(this.props.unitProps);
		//this.props.projectile(this.props.unitProps);
	},

	render: function() {
		//onClick accesses info and selects the unit
		return (
			<img
				//Combine the img-responsive class and a class toggle based on whether the image is the selected unit
				className={[this.props.responsive, this.props.selectUnit ? 'selected' : ''].join(' ')}
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

module.exports = Ally;