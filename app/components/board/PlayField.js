var React = require("react");
var Arena = require("./Arena");
var UnitInfo = require("./UnitInfo");

var PlayField = React.createClass({
	getInitialState: function() {
		return {
			unitStats: "",
			selectUnit: "",
			highlighted: false
		};
		this.deselectUnit = this.deselectUnit.bind(this);
	},

	getUnitInfo: function(unit) {
		var currUnit = unit;
		this.setState({unitStats: currUnit});
	},

	componentDidUpdate: function(prevProps, prevState) {
		// console.log("Previous state:", prevState.unitStats);
		// console.log("Current state:", this.state.unitStats);
	},

	render: function() {
		return (
			<div>
				<div style={{
				width:'100%',
				clear: 'both',
				float: 'left',
				display: 'block',
				position: 'relative'
				}}
				>
					<div className="battleField" style={{
					width: '80%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<div className="unitGrid" style={{backgroundColor: 'powderblue'}}>
							<Arena getUnitInfo={this.getUnitInfo} />
						</div>
					</div>
					<div className="infoPanel" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}>
						<UnitInfo getUnitInfo={this.state.unitStats} />
					</div>
				</div>
				<div style={{
				width:'100%',
				clear: 'both',
				float: 'left',
				display: 'block',
				position: 'relative'
				}}
				>
					<div className="enemyLogo" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<h3>Enemy Logo</h3>
					</div>
					<div className="enemyStats" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<h3>Enemy Stats</h3>
					</div>
					<div className="spells" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<h3>Spells</h3>
					</div>
					<div className="playerStats" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<h3>Player Stats</h3>
					</div>
					<div className="playerLogo" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<h3>Player Logo</h3>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = PlayField;