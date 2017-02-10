var React = require("react");
import Enemy from "../units/Enemy";
import Ally from "../units/Ally";

export default class UnitInfo extends React.Component{
	constructor() {
		super();
	}

	alive() {
		if (this.props.getUnitInfo.totalHP > 0) {
			return <span>{this.props.getUnitInfo.totalHP} life points<br/>
				({this.props.getUnitInfo.no} / {this.props.getUnitInfo.initHP / this.props.getUnitInfo.hp} members)<br/></span>
		} else {
			return <span style={{color:'red'}}>Deceased<br/></span>
		}
	}
	
	ifPoison() {
		if (this.props.getUnitInfo.poison === 1) {
			return <span>Poisonous<br/></span>
		} else {
			return null
		}
	}

	ifAction() {
		if (this.props.getUnitInfo.speed > 0) {
			return <span>{this.props.getUnitInfo.speed} actions left<br/></span>
		} else {
			return <span>All actions spent<br/></span>
		}
	}

	ifAir() {
		if (this.props.getUnitInfo.air === 1) {
			return <span>Air Unit<br/></span>
		} else {
			return null
		}
	}

	ifAmmo() {
		if (this.props.getUnitInfo.ammo > 0) {
			return <span>{this.props.getUnitInfo.ammo} ammo left<br/></span>
		} else {
			return null
		}
	}

	ifDay() {
		if (this.props.getUnitInfo.day === 1) {
			return <span>Day Unit</span>
		} else {
			return <span>Night Unit</span>
		}
	}

	ifMagic() {
		if (this.props.getUnitInfo.magic > 0) {
			return <span>{this.props.getUnitInfo.magic} magic bolts left<br/></span>
		} else {
			return null
		}
	}

	ifRanged() {
		if (this.props.getUnitInfo.ranged > 0) {
			return <span>Ranged attack {this.props.getUnitInfo.ranged}<br/></span>
		} else {
			return null
		}
	}

	ifSpells() {
		if (this.props.getUnitInfo.spells > 0) {
			return <span>{this.props.getUnitInfo.spells} spells<br/></span>
		} else {
			return null
		}
	}
	
	render() {
		var stuff = this.props.getUnitInfo;
		//console.log(stuff);
		//src={"assets/images/" + [this.state.alive ? this.props.unitProps.image : 'miccatl.png']}
		//console.log(this.props);

		//Indicate whether unit is ally or enemy for condition
		if (stuff !== "") {
			return (
				//Create a property that distinguishes ally from enemy
				<div>
				<h3 style={{textAlign:'center'}}>{this.props.getUnitInfo.name}</h3>
				<h3 style={{textAlign:'center'}}>{this.props.getUnitInfo.team}</h3>
				<img src={"assets/images/" + this.props.getUnitInfo.image} width={150} height={150} className={"img-responsive"} /><br/>
				<h4 style={{textAlign:'center'}}>
				{this.props.getUnitInfo.type}<br/>
				Level {this.props.getUnitInfo.level}<br/>
				{this.props.getUnitInfo.xp} experience<br/>
				{this.alive()}
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
				</h4>
				</div>
			)
		} else {
			return null;
		}
	}
};