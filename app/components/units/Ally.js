var React = require("react");

export default class Ally extends React.Component{

	constructor() {
		super();
		this.state = {
			totalHP: 0,
			alive: true
			// xPos: this.unitProps.initX,
			// yPos: this.unitProps.initY,
			// ranged: this.unitProps.ranged,
			// occSquaresArray: [],
			// selectedHighlight: false
		};
		this.waiting = false;
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		var unitIsSelected = this.props.unitIsSelected;

		var selectProp = this.props.selectUnit;

		this.props.getUnitInfo(this.props.unitProps);
		//This is preventing the disappearance
		//TO WORK: Revise to allow for movement, passive actions
		//AND CONDITION FOR ONLY IF STILL ALIVE
		if (!unitIsSelected && this.props.playerTurn) {

			// Getting unit info
			this.props.getAllyUnit(this.props.unitProps);

			// Setting up conditions for proper movement
			this.props.emptySquare(this.props.unitProps);
			
			// Preparing unit to attack enemy
			this.props.projectile(this.props.unitProps);
			this.props.melee(this.props.unitProps.speed);

			// TO WORK: For now, just testing to ensure that the spell icons will appear
			// Revise and move to the Options panel component when the menu is ready to provide spells
			// this.props.spellIcon(this.props.unitProps);
		}

		// Removed because it is interfering with the selection
		// else {
		// 	this.props.resetSelection();
		// }

		// TO WORK: Will restoring these methods repair the movement or crash the app with rendering?
		// this.setState({xPos:this.props.unitProps.xPos});
		// this.setState({yPos:this.props.unitProps.yPos});

		//TO WORK: add a conditional and apply a state that prevent previously clicked unit from replacing the unit
		//in the newly clicked square
		//This has to be done for the Ally component, it isn't working in Square
		//because the cursor clicks on the ally instead of the square itself

		//This comparison should take place within the unit construction, it isn't working in Square

		//If this works in the Arena, remove it here
		var updateCoords = this.props.updateCoords;
		var xPos;
		var yPos;

		if (typeof(this.props.unitProps.xPos) === 'number' && typeof(this.props.unitProps.yPos) === 'number') {
			console.log("unitProps.xPos and unitProps.yPos now exist");
			xPos = this.props.unitProps.xPos;
			yPos = this.props.unitProps.yPos;
		} else {
			//TO WORK: replace with props for state
			console.log("unitProps.initX and unitProps.initY are used");
			xPos = this.state.xPos;
			yPos = this.state.yPos;
		}

		for (let i=0; i<updateCoords.length; i++) {
			if (xPos === updateCoords[i][0] && yPos === updateCoords[i][1]) {
				console.log("Ally component: This space is already occupied!");
				console.log(xPos, yPos);
				//this.setState({empty:false});
			}
		}

		//previousCoords() isn't working, so commented out - probably to remove
		//The cursor is clicking on the unit, so this must be set up in the Arena component to prevent switching

		//If unit has projectile ammo, it can receive tahui spell
		if (this.props.unitProps.ammo > 0 && this.props.unitProps.tahuiSpell === false) {
			//this.props.tahui(this.props.unitProps.ranged);
		}
	}

	/*
	componentDidUpdate(previousState) {
		if (this.state.occSquaresArray.length < 13) {
			this.setState({occSquaresArray: this.state.occSquaresArray.concat([ [this.state.xPos,this.state.yPos] ])});
		}
		

//this.setState(previousState => ({occSquaresArray: [...previousState.occSquaresArray, this.props.unitProps.name]}) );
		//console.log(unitPositions);
		//console.log(newProps);
	
		// this.setState({occSquaresArray: this.state.occSquaresArray.concat([this.state.xPos,this.state.yPos])});
	}
	*/

	componentDidMount(){
		this.props.assessAllyUnit(this.props.unitProps);
	}

	componentWillReceiveProps(newProps){

		//Toggle unit graphic if health points at 0 or less, i.e. deceased

		if (this.props.unitProps.totalHP <= 0) {
			this.setState({alive : false});
		}

		/*
		if (this.props.unitProps.totalHP > 0 && this.props.allyTargetId === this.props.unitProps.id) {
			//console.log("Alive and ready for enemy to shoot (after first action, from CWRP)");
			console.log(this.props.allyTargetId);
			//Run only for ally with the selected ID
			// console.log(this.props.allyTargetId);
			this.props.shootAlly(this.props.unitProps.id, this.props.unitProps.totalHP, this.props.unitProps.defense, this.props.unitProps.resist);
		}
		*/

		/*
		else {
			//console.log("Alive and ready for enemy to shoot (after first action, from CWRP)");
			//Run only for ally with the selected ID
			this.props.shootAlly(this.props.unitProps.id, this.props.unitProps.totalHP, this.props.unitProps.defense, this.props.unitProps.resist);
		}
		*/
	}

	componentDidUpdate(prevProps, prevState){
		//console.log("Notice from CDU");
		if (this.props.allyTargetId === this.props.unitProps.id) {
		// console.log(this.props.unitProps.totalHP);
		// console.log(this.props.unitProps.id);
		// console.log(this.props.allyTargetId);
		}
		
		this.props.assessAllyUnit(this.props.unitProps);

		if (this.props.waitClicked && this.props.unitProps.speed > 0) {
			this.waiting = true;
		} else {
			this.waiting = false;
		}

		/*
		if (this.props.allyTargetId === this.props.unitProps.id) {
			console.log("This is a match in Ally", this.props.allyTargetId);
		}
		if (this.props.unitProps.totalHP > 0) {
			console.log("Unit is healthy");
		}
		*/

		if (this.props.unitProps.totalHP > 0) {
			this.props.attackAlly(this.props.unitProps);

			if (this.props.allyTargetId === this.props.unitProps.id) {
				//console.log("Alive and ready for enemy to shoot (after first action, from CWRP)");
				// console.log(this.props.allyTargetId);
				//Run only for ally with the selected ID
				// console.log(this.props.allyTargetId);
				
				this.props.shootAlly(this.props.unitProps.name, this.props.unitProps.id, this.props.unitProps.totalHP, this.props.unitProps.defense, this.props.unitProps.resist);
				this.props.movesTowardAlly(this.props.unitProps);
			}
			// this.props.movesTowardAlly(this.props.unitProps);

		}
	}

	render() {
		var selectedHighlight = false;
		if (this.props.id === this.props.propsUnitId) {
			//console.log(this.props.id, "matched");
			selectedHighlight = true;
		}

		var waiting = false;
		if (this.waiting) {
			waiting = true;
		}

		//onClick accesses info and selects the unit
		return (
			<img
				//Combine the img-responsive class and a class toggle based on whether the image is the selected unit
				className={"allyUnit " + [this.props.responsive, this.props.cursorAlly, waiting ? 'wait' : '', selectedHighlight ? 'selected' : ''].join(' ')}
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