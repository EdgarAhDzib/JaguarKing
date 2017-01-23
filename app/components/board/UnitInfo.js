var React = require("react");
var Enemy = require("../units/Enemy");
var Ally = require("../units/Ally");

var UnitInfo = React.createClass({

	ifPoison : function() {
		if (this.props.getUnitInfo.poison === 1) {
			return <span>Poisonous<br/></span>
		} else {
			return null
		}
	},

	ifAction : function() {
		if (this.props.getUnitInfo.speed > 0) {
			return <span>{this.props.getUnitInfo.speed} actions left<br/></span>
		} else {
			return <span>All actions spent til next turn<br/></span>
		}
	},

	ifAir : function() {
		if (this.props.getUnitInfo.air === 1) {
			return <span>Air Unit<br/></span>
		} else {
			return null
		}
	},

	ifAmmo : function() {
		if (this.props.getUnitInfo.ammo > 0) {
			return <span>{this.props.getUnitInfo.ammo} ammo left<br/></span>
		} else {
			return null
		}
	},

	ifDay : function() {
		if (this.props.getUnitInfo.day === 1) {
			return <span>Day Unit</span>
		} else {
			return <span>Night Unit</span>
		}
	},

	ifMagic : function() {
		if (this.props.getUnitInfo.magic > 0) {
			return <span>{this.props.getUnitInfo.magic} magic bolts left<br/></span>
		} else {
			return null
		}
	},

	ifRanged : function() {
		if (this.props.getUnitInfo.ranged > 0) {
			return <span>Ranged attack {this.props.getUnitInfo.ranged}<br/></span>
		} else {
			return null
		}
	},

	ifSpells : function() {
		if (this.props.getUnitInfo.spells > 0) {
			return <span>{this.props.getUnitInfo.spells} spells<br/></span>
		} else {
			return null
		}
	},
	
	render: function() {
		var stuff = this.props.getUnitInfo;

		//console.log(stuff);
		//Indicate whether unit is ally or enemy for condition
		if (stuff !== "") {
			return (
				//Create a property that distinguishes ally from enemy
				<div>
				<h3 style={{textAlign:'center'}}>{this.props.getUnitInfo.name}</h3>
				<h3 style={{textAlign:'center'}}>{this.props.getUnitInfo.team}</h3>
				<img src={"assets/images/" + this.props.getUnitInfo.image} width={150} height={150} className={"img-responsive"} /><br/>
				<h5 style={{textAlign:'center'}}>{this.props.getUnitInfo.no} members<br/>
				{this.props.getUnitInfo.type}<br/>
				Level {this.props.getUnitInfo.level}<br/>
				{this.props.getUnitInfo.xp} experience<br/>
				{this.props.getUnitInfo.hp} life points<br/>
				Melee strength {this.props.getUnitInfo.melee}<br/>
				{this.ifRanged()}
				Defense {this.props.getUnitInfo.defense}<br/>
				{this.ifMagic()}
				{this.ifPoison()}
				{this.ifSpells()}
				Magic resistance {this.props.getUnitInfo.resist}<br/>
				{this.ifAction()}
				{this.ifAmmo()}
				Perception {this.props.getUnitInfo.percept}<br/>
				{this.ifAir()}
				{this.ifDay()}
				</h5>
				</div>
			)
		} else {
			return null;
		}
	}
});

module.exports = UnitInfo;