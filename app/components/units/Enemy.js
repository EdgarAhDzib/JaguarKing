var React = require("react");

export default class Enemy extends React.Component{

	constructor() {
		super();
		this.state = {
			totalHP: 0,
			alive: true
		};
		this.enemyAlive = {alive: true};
		this.proximate = {attack: false};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.getUnitInfo(this.props.unitProps);
		this.props.getUnit(this.props.unitProps);

		this.props.damageSpell(this.props.unitProps.id, this.props.unitProps.totalHP, this.props.unitProps.resist);
		this.props.shootEnemy(this.props.unitProps.id, this.props.unitProps.totalHP, this.props.unitProps.defense, this.props.unitProps.resist);
		if (this.proximate.attack) {
			this.props.attackEnemy(this.props.unitProps.id, this.props.unitProps.totalHP, this.props.unitProps.defense, this.props.unitProps.melee, this.props.unitProps.no);
		}
		
		this.props.resetSelection();
	}

	componentWillReceiveProps(newProps){
		//This isn't getting updated: it is showing the properties passed through the Enemy component
		//console.log(newProps.unitHP);
		if (this.state.totalHP !== newProps.unitHP) {
			this.setState({totalHP:newProps.unitHP});
		}

		var stringCoords = [];
		//Convert the arrays to dash-separated strings, each pushed into a new array
		//whose indices can be compared to the string value of the square's coordinates ('x-y')
		if (newProps.neighborCoords.length > 0) {
			for (let i=0; i<newProps.neighborCoords.length; i++) {
				var stringed = newProps.neighborCoords[i].join('-');
				stringCoords.push(stringed);
			}
		}
		
		var currCoordsStr = [this.props.unitProps.xPos, this.props.unitProps.yPos].join('-');
		
		if (stringCoords.indexOf(currCoordsStr) > -1) {
			//console.log(stringCoords.indexOf(currCoordsStr), currCoordsStr, stringCoords.length);
			this.proximate.attack = true;
		} else {
			//This also resets any previously calculated enemy units that are no longer within ally's proximity
			this.proximate.attack = false;
		}
		
		if (this.props.unitProps.totalHP <= 0) {
			this.setState({alive : false});
		} else {
			this.props.sortEnemyUnits(this.props.unitProps);
		}
	}

	render() {
		// console.log(this.state);
		// console.log(this.props);

		//onClick should access info and select the unit
		return (
			<img
				className={["enemyUnit", this.props.responsive, this.props.cursorEnemy, this.proximate.attack ? this.props.cursorSword : ''].join(' ')}
				src={"assets/images/" + [this.state.alive ? this.props.unitProps.image : 'miccatl.png']}
				width={this.props.unitWidth}
				height={this.props.unitHeight}
				alt={this.props.unitProps.name}
				id={this.props.id}
				onClick={this.handleClick}
			/>
		)
	}
};