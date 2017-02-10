var React = require("react");
var axios = require("axios");
var Square = require("./Square");
import Enemy from "../units/Enemy";
import Ally from "../units/Ally";

import { connect } from "react-redux";

// Imports for the Redux actions
// import { tahui, fireball, kieri } from '../../actions/spellActions'
import { shootEnemy, boltEnemy, attackEnemy, tahui, fireball, kieri } from '../../actions/movesActions'
import { selectTeam } from '../../actions/teamsActions'

@connect((store) => {
	//console.log(store);
	return {
		//Properties from reducer
		prevId: store.moves.prevId,
		prevHp: store.moves.prevHp,
		unitId: store.moves.unitId,
		totalHP: store.moves.totalHP,
		ranged: store.moves.ranged,
		ammo: store.moves.ammo,
		magic: store.moves.magic,
		melee: store.moves.melee,
		defense: store.moves.defense,
		initSpeed: store.moves.initSpeed,
		speed: store.moves.speed,

		//Props for counter-attack during melee
		attackerDefense: store.moves.attackerDefense,
		unitMelee: store.moves.unitMelee,
		unitNum: store.moves.unitNum,
		attackersNum: store.moves.attackersNum,
		
		increment: store.moves.increment,
		tahuiSpell: store.moves.tahuiSpell,
		castersNum: store.moves.castersNum,
		unitIsAffected: store.moves.unitIsAffected,

		playerTeam: store.teams.team

		//prevXY: store.moves.prevXY
	};
})

export default class Arena extends React.Component{

	constructor() {
		super();
		this.state = {
			playerTurn: true,

			enemyOccPos: [
				[5,5],
				[4,6],
				[6,4],
				[7,3],
				[3,7],
				[4,5],
				[5,4],
				[6,3],
				[3,6],
				[7,2],
				[2,7],
				[4,4]
				//Temporarily moved to [12,11],[11,12] for melee testing	
			],
			allyOccPos: [
				[12,12],
				[13,11],
				[11,13],
				[10,14],
				[14,10],
				[13,12],
				[12,13],
				[11,14],
				[14,11],
				[10,15],
				[15,10],
				[13,13]
			],
			occPosIndex: -1,
			unitX: -1,
			unitY: -1,
			empty: true,
			unitIsSelected: false,
			unitIsAffected: false,
			occSquaresArray: [],
			selectedUnitId: "",
			prevUnit: "",
			newUnit: "",
			previousUnitXY: [],
			prevUnitRanged: 0,
			movesLeft: -1,
			//targetSquares: [],
			enemies: [],
			allies: [],
			enemyMoves: [],
			allyMoves: [],
			cursorEnemy: "",
			cursorSword: "",
			cursorAlly: "",
			actionIsSelected: false,
			waitClicked: false,
			selectedSpell: "",

			//Unit properties
			ranged: 0,
			selectedUnitHP: 0
		};

		//Constructor objects to store changing properties
		this.selectedArenaUnit = { 
			selectedUnitId : "",
			selectUnit: false,
			selectUnitProps : {}
		};

		//Set up props for previous unit, unit ready for action upon target
		this.previousUnit = {
			prevUnitId : "",
			prevUnitProps : {}
		};

		this.arenaAction = { 
			actionIsSelected : false,
			cursorEnemy : "",
			cursorAlly : "",
			selectedSpell : "",
			spellCost : 0,
			enemyNeighbor : false,
			neighborCoords: [],
		};

		this.reset = {
			speed: false,
			initEnemyMoves: [],
			initAllyMoves: [],
		}

		this.enemyTeamUnits = {
			projectileUnits : [],
			meleeUnits: [],
		};

		this.allyCalculations = {
			rankAllyHp : [],
			allyTargetId : "",
			allOccupied : [],
		};

		this.allyPositions = [
				[12,12],
				[13,11],
				[11,13],
				[10,14],
				[14,10],
				[13,12],
				[12,13],
				[11,14],
				[14,11],
				[10,15],
				[15,10],
				[13,13]
			];

		this.enemyPositions = [
				[5,5],
				[4,6],
				[6,4],
				[7,3],
				[3,7],
				[4,5],
				[5,4],
				[6,3],
				[3,6],
				[7,2],
				[2,7],
				[4,4]
		];

		this.targetSquares = [];
		this.occPosIndex = -1;

		this.emptySquare = this.emptySquare.bind(this);
		this.available = this.available.bind(this);
		this.moveToXY = this.moveToXY.bind(this);
		this.reduceAction = this.reduceAction.bind(this);
		this.projectile = this.projectile.bind(this);
		this.melee = this.melee.bind(this);
		this.spellIcon = this.spellIcon.bind(this);
		this.resetSelection = this.resetSelection.bind(this);

		//Movements by enemy toward ally team
		this.sortEnemyUnits = this.sortEnemyUnits.bind(this);
		this.attackAlly = this.attackAlly.bind(this);
		this.movesTowardAlly = this.movesTowardAlly.bind(this);
		this.shootAlly = this.shootAlly.bind(this);
		this.assessAllyUnit = this.assessAllyUnit.bind(this);
		this.enemySpace = this.enemySpace.bind(this);

		//Functions from the Redux reducers
		this.getUnit = this.getUnit.bind(this);
		this.previousCoords = this.previousCoords.bind(this);
		this.shootEnemy = this.shootEnemy.bind(this);
		this.attackEnemy = this.attackEnemy.bind(this);
		this.tahui = this.tahui.bind(this);
		this.damageSpell = this.damageSpell.bind(this);
		this.immunity = this.immunity.bind(this);
		this.kieri = this.kieri.bind(this);
	}

	emptySquare(open) {
		// console.log(open);
		this.arenaAction.actionIsSelected = true;

		var enemyPositions = this.state.enemyOccPos;

		var coordArray = [];
		if (open.ally) {
			//If absolute value of square distance x <= 1 && absolute value of distance y <= 1, push to coordArray

			//Compare the X coordinates to the unit's
			for (let i=0; i<16; i++) {
				//Compare the Y coordinates to the unit's
				for (let j=0; j<16; j++) {
					if (open.xPos && open.yPos && open.speed > 0) {
						if (Math.abs(open.xPos - i) <= 1 && Math.abs(open.yPos - j) <= 1) {
							coordArray.push([i,j]);
						}
						//start from initialized positions if unit's xPos and yPos haven't been yet set
					} else {
						if (Math.abs(open.initX - i) <= 1 && Math.abs(open.initY - j) <= 1) {
							coordArray.push([i,j]);
						}
					}
				}
			}

			//Initialize variables to store the selected unit's current XY coordinates
			var selectedX;
			var selectedY;
			
			if (open.xPos && open.yPos) {
				selectedX = open.xPos;
				selectedY = open.yPos;
			} else {
				selectedX = open.initX;
				selectedY = open.initY;
			}

			var enemyNeighbors = [];
			for (let i=0; i<enemyPositions.length; i++) {
				for (let j=0; j<coordArray.length; j++) {
					if (enemyPositions[i][0] === coordArray[j][0] && enemyPositions[i][1] === coordArray[j][1]) {
						enemyNeighbors.push(coordArray[j]);
					}
				}
			}

			this.targetSquares = coordArray;
			this.arenaAction.neighborCoords = enemyNeighbors;

			console.log(this.selectedArenaUnit);
			console.log(enemyNeighbors);

			//TO WORK: Move enemy coordinate calculations here from available() function

			// These don't work because the component doesn't get re-rendered, so keep the state change
			// this.selectedArenaUnit.selectUnitProps.xPos = selectedX;
			// this.selectedArenaUnit.selectUnitProps.YPos = selectedY;

			this.setState({
				//targetSquares: coordArray,
				//selectedUnitId: open.id,
				// movesLeft: open.speed,
				unitX: selectedX,
				unitY: selectedY,
			});

			for (let i=0; i<this.state.allyOccPos.length; i++) {
				if (this.state.allyOccPos[i][0] == selectedX && this.state.allyOccPos[i][1] == selectedY) {
					// console.log("coords match");
					// console.log(selectedX,selectedY);
					// console.log("Array position", i);
					this.occPosIndex = i;
				}
			}

		}
	}

	available(square){
		var openXY = [];

		for (let i=0; i<13; i++){
			//square.children[0] has properties for the enemy team, and square.children[1] has the ally's
			if (square.children[0][i] != null || square.children[1][i] != null){
				openXY.push([square.xCoord,square.yCoord]);
			}
		}
		return openXY;
	}

	moveToXY(unit) {
		var updateCoords = this.state.allyOccPos;
		var index = this.occPosIndex;
		console.log("Ally array index",index);

		//TO WORK: This needs comparison with the updateCoords, it must not run if the coordinates are already occupied
		//And the reduceAction shouldn't be fired, either
		//Add this.state.playerTurn condition to ensure that player can't move units during opponent's turn
		if (unit.length > 0) {
			var squareCoord = unit.split(",").map(Number);

			if (squareCoord[0] !== this.state.unitX || squareCoord[1] !== this.state.unitY) {

				this.setState({
					unitX:squareCoord[0],
					unitY:squareCoord[1]
				});
				this.selectedArenaUnit.selectUnit = false;
				
				console.log("moveToXY was run");

				// Tried with props, but failed: requires state setting for re-rendering
				updateCoords.splice(index, 1, [squareCoord[0],squareCoord[1]]);

				this.setState({allyOccPos:updateCoords});

			} else {
				console.log("moveToXY didn't run");
			}
		}
	}

	//TO WORK: The former seems redundant, it doesn't appear to be affecting anything
	resetSelection() {
		//this.setState({unitIsSelected:false});
		this.selectedArenaUnit.selectUnit = false;
	}

	//Speed is a condition: if speed > 0, actions are still available; else no more are permissible
	reduceAction(action, unit) {
		//If movement, reduce by 1; if attack, reduce by 2

		//Two versions required here: if a spatial movement, use selectedAreaUnit; if attack, use previousUnit
		//Incorporate as second argument in this function, to compare whether speed will be reduced to previous or current unit
		
		//TO WORK: add a nested [id,speed] array, to check whether any moves remain and with whom
		var remainingMoves;
		if (this.state.playerTurn) {
			remainingMoves = this.state.allyMoves;
		} else if (!this.state.playerTurn) {
			remainingMoves = this.state.enemyMoves;
		}


		if (unit === "current") {

			var currUnit = this.selectedArenaUnit.selectUnitProps;
			var currUnitId = currUnit.id;

			var tempSpeed = currUnit.speed;
			if (currUnit.speed > 0) {
				//Adding the tempSpeed variable prevents automatic decrement to zero
				currUnit.speed = tempSpeed - action;
				for (let i=0; i<remainingMoves.length; i++) {
					if (remainingMoves[i][0] === currUnitId) {
						console.log(i, currUnitId);
						remainingMoves.splice(i, 1, [currUnitId,currUnit.speed]);
						if (this.state.playerTurn) {
							this.setState({allyMoves:remainingMoves});
						} else {
							this.setState({enemyMoves: remainingMoves});
						}
					}
				}

			}
		} else if (unit === "previous") {

			var currUnit = this.previousUnit.prevUnitProps;
			var currUnitId = currUnit.id;

			var tempSpeed = currUnit.speed;
			if (currUnit.speed > 0) {
				currUnit.speed = tempSpeed - action;
				for (let i=0; i<remainingMoves.length; i++) {
					if (remainingMoves[i][0] === currUnitId) {
						console.log(i, currUnitId);
						remainingMoves.splice(i, 1, [currUnitId,currUnit.speed]);
						if (this.state.playerTurn) {
							this.setState({allyMoves:remainingMoves});
						} else {
							this.setState({enemyMoves: remainingMoves});
						}
					}
				}

			}
		}
		console.log(this.state.allyMoves);
	}

	getUnit(unit) {
		if (this.selectedArenaUnit.selectedUnitId !== unit.id && this.state.playerTurn) {

			//If a new unit is selected, store the props of the previous unit for action
			this.previousUnit.prevUnitId = this.selectedArenaUnit.selectedUnitId;
			this.previousUnit.prevUnitProps = this.selectedArenaUnit.selectUnitProps;

			this.selectedArenaUnit.selectedUnitId = unit.id;
			this.selectedArenaUnit.selectUnit = true;
			this.selectedArenaUnit.selectUnitProps = unit;
		}
	}

	//TO WORK: Will this be necessary? Nothing seems to call it
	previousCoords(x,y) {
		this.props.dispatch(previousCoords(x,y));
	}

	projectile(unit) {

		//Condition to select muwieri or spear cursor depending whether attack is magic or ranged
		if (unit.ammo > 0 && unit.speed > 0) {
			console.log("Spears cursor");
			this.setState({cursorEnemy: "spears"});
		} else if (unit.magic > 0 && unit.speed > 0) {
			this.setState({cursorEnemy: "muwieri"});
		} else {
			this.setState({cursorEnemy: ""});
		}
	}

	melee(speed) {
		console.log(this.arenaAction.actionIsSelected);

		if (speed > 0 && this.arenaAction.actionIsSelected) {
			this.setState({cursorSword: "macuahuitl"});
		} else {
			this.setState({cursorSword: ""});
		}
	}

	//blood, death, life, nature_magic icons
	//TO WORK: Remove this: the spells and casters should be selected from the SPELLS button, not the units themselves
	spellIcon(unit) {
		/*
		if (unit.spells > 0) {
			//Healer, Necromancer, Nagual (blood), Sorcerer (nature)
			switch (unit.name) {
				case "Healer" :
					this.setState({cursorAlly: "life_magic"});
					break;
				case "Necromancer" :
					this.setState({cursorEnemy: "death_magic"});
					break;
				case "Nagual" :
					this.setState({cursorEnemy: "blood_magic"});
					break;
				case "Sorcerer" :
					this.setState({cursorEnemy: "nature_magic"});
					break;
				default :
			}
		}
		*/
	}

	shootEnemy(id, hp, defense, resist) {
		if (this.state.cursorEnemy === 'spears') {
			//And if target is !ally
			console.log("Id:", id, "Health:", hp, "Defense:" , defense);
			console.log("Attacker Id:", this.previousUnit.prevUnitProps.id, "number", this.previousUnit.prevUnitProps.no, "ranged", this.previousUnit.prevUnitProps.ranged, "ammo", this.previousUnit.prevUnitProps.ammo);
			this.props.dispatch(shootEnemy(this.previousUnit.prevUnitProps.id, this.previousUnit.prevUnitProps.totalHP, this.previousUnit.prevUnitProps.ranged, this.previousUnit.prevUnitProps.no, this.previousUnit.prevUnitProps.ammo, id, hp, defense));
			this.reduceAction(2,"previous");
		} else if (this.state.cursorEnemy === 'muwieri') {
			console.log("Id:", id, "Health:", hp, "Resist:" , resist);
			console.log("Attacker Id:", this.previousUnit.prevUnitProps.id, "number", this.previousUnit.prevUnitProps.no, "ranged", this.previousUnit.prevUnitProps.ranged, "bolts", this.previousUnit.prevUnitProps.magic);
			this.props.dispatch(boltEnemy(this.previousUnit.prevUnitProps.id, this.previousUnit.prevUnitProps.totalHP, this.previousUnit.prevUnitProps.ranged, this.previousUnit.prevUnitProps.no, this.previousUnit.prevUnitProps.magic, id, hp, resist));			
			this.reduceAction(2,"previous");
		}
	}

	attackEnemy(id, hp, defense, melee, num) {
		console.log("attackEnemy function here");
		if (this.state.cursorSword === 'macuahuitl') {
			//And if target is !ally
			console.log("Id:", id, "Health:", hp, "Defense:" , defense, "Melee:", melee);
			console.log("Attacker Id:", this.previousUnit.prevUnitProps.id, "number", this.previousUnit.prevUnitProps.no, "melee", this.previousUnit.prevUnitProps.melee, "defense", this.previousUnit.prevUnitProps.defense);
			this.props.dispatch(attackEnemy(this.previousUnit.prevUnitProps.id, this.previousUnit.prevUnitProps.totalHP, this.previousUnit.prevUnitProps.melee, this.previousUnit.prevUnitProps.no, this.previousUnit.prevUnitProps.defense, id, hp, defense, melee, num));
			this.arenaAction.actionIsSelected = false;
			this.reduceAction(2,"previous");
		}
	}

	//The Redux reducer functions
	tahui(ranged) {
		this.props.dispatch(tahui(ranged));
	}

	//This may be revised into a general function with switch / cases for different enemies with similar arguments
	damageSpell(id, hp, resist) {
		if (this.state.actionIsSelected && this.arenaAction.selectedSpell === "Fireball") {
			//console.log(id, hp, resist);
			this.props.dispatch(fireball(id, hp, resist));
			console.log("Taste the flames!");
			this.props.resetAction(this.arenaAction.spellCost);
			this.props.spellIsCast();

			console.log("Reset state to no spell selection within Fireball function");
			this.setState({ 
				actionIsSelected: false,
			});
		}
	}

	immunity() {
		// console.log(this.state.actionIsSelected);
		// console.log(this.state.selectedSpell);

		if (this.state.actionIsSelected && this.arenaAction.selectedSpell === "Immunity") {
			console.log("Immunity spell ready!");
		}
	}

	kieri(unit) {
		// console.log(this.state.actionIsSelected);
		// console.log(this.state.selectedSpell);

		if (this.state.actionIsSelected && this.arenaAction.selectedSpell === "Crazy root") {
			console.log("Crazy root spell ready!")
		}
	}

	//TO WORK: Prepare the enemy units and list their moves
	sortEnemyUnits(unit){
		var enemyIsSelected = false;
		var duplicateId = "";

		//Check whether unit with projectile weapon already in array
		for (let i=0; i<this.enemyTeamUnits.projectileUnits.length; i++) {
			if (unit.id === this.enemyTeamUnits.projectileUnits[i]['id'] && unit.magic === this.enemyTeamUnits.projectileUnits[i]['magic'] && unit.ammo === this.enemyTeamUnits.projectileUnits[i]['ammo']){
				enemyIsSelected = true;
				duplicateId = unit.id;
			}  else if (unit.id === this.enemyTeamUnits.projectileUnits[i]['id'] && ( unit.magic !== this.enemyTeamUnits.projectileUnits[i]['magic'] || unit.ammo !== this.enemyTeamUnits.projectileUnits[i]['ammo']) ) {
				//Replace the unit's index with updated stats if its projectile number has been modified
				this.enemyTeamUnits.projectileUnits.splice(i, 1, unit);
			}
		}

		//Check whether melee-combat units already in array
		for (let i=0; i<this.enemyTeamUnits.meleeUnits.length; i++) {
			if (unit.id === this.enemyTeamUnits.meleeUnits[i]['id'] && unit.totalHP === this.enemyTeamUnits.meleeUnits[i]['totalHP'] ) {
				enemyIsSelected = true;
				duplicateId = unit.id;
			}  else if (unit.id === this.enemyTeamUnits.meleeUnits[i]['id'] && unit.totalHP !== this.enemyTeamUnits.meleeUnits[i]['totalHP'] ) {
				//Replace the unit's index with updated stats if its projectile number has been modified
				this.enemyTeamUnits.meleeUnits.splice(i, 1, unit);
			}
		}

		//Select unit whether it is unique, alive, ready, and projectile
		if (!enemyIsSelected && duplicateId === "" && unit.totalHP > 0 && unit.speed > 0 && unit.ranged > 0) {
			//This needs revision, the units are getting inserted thrice
			this.enemyTeamUnits.projectileUnits.push(unit);
		} else if (!enemyIsSelected && duplicateId === "" && unit.totalHP > 0 && unit.speed > 0 && unit.magic === 0 && unit.ammo === 0) {
			//Get all units with no (more) projectile attack
			this.enemyTeamUnits.meleeUnits.push(unit);
		}

		//Projectile enemies strike first
		//Then melee-based enemies follow --> this might work better within shootAlly() scope
	}

	shootAlly(name, id, hp, defense, resist){
		// console.log("Shoot Ally function");

		if (id && hp && defense && resist && !this.state.playerTurn) {
			// console.log("All stats reported");
			console.log(id,hp,defense,resist);
			
			var rangedUnits = this.enemyTeamUnits.projectileUnits;

			//Select the first projectile unit for ranged attack
			if (rangedUnits.length > 0) {
				for (let i=0; i<rangedUnits.length; i++) {
					if (rangedUnits[i]['speed'] > 0) {
						this.previousUnit.prevUnitProps = rangedUnits[i];
						//TO WORK: Necessary? or remove?
						this.previousUnit.prevUnitId = rangedUnits[i]['id'];
					}
				}
			}

			//If enemy attacker shoots with projectile ammo
			if (this.previousUnit.prevUnitProps.ammo > 0) {
				// Access from Ally component, just the one with matching ID
				// console.log("Id:", id, "Health:", hp, "Defense:", defense);
				// console.log("Attacker Id:", this.previousUnit.prevUnitProps.id, "number", this.previousUnit.prevUnitProps.no, "ranged", this.previousUnit.prevUnitProps.ranged, "ammo", this.previousUnit.prevUnitProps.ammo);
				console.log(this.previousUnit.prevUnitProps.name, "shot", name, id);
				this.props.dispatch(shootEnemy(this.previousUnit.prevUnitProps.id, this.previousUnit.prevUnitProps.totalHP, this.previousUnit.prevUnitProps.ranged, this.previousUnit.prevUnitProps.no, this.previousUnit.prevUnitProps.ammo, id, hp, defense));
				// shootEnemy(prevId, attackerHp, ranged, num, ammo, id, hp, defense)
				this.reduceAction(2,"previous");
			//Else if enemy attacker shoots with magic bolts
			} else if (this.previousUnit.prevUnitProps.magic > 0) {
				// console.log("Id:", id, "Health:", hp, "Resist:", resist);
				// console.log("Attacker Id:", this.previousUnit.prevUnitProps.id, "number", this.previousUnit.prevUnitProps.no, "ranged", this.previousUnit.prevUnitProps.ranged, "bolts", this.previousUnit.prevUnitProps.magic);
				this.props.dispatch(boltEnemy(this.previousUnit.prevUnitProps.id, this.previousUnit.prevUnitProps.totalHP, this.previousUnit.prevUnitProps.ranged, this.previousUnit.prevUnitProps.no, this.previousUnit.prevUnitProps.magic, id, hp, resist));			
				console.log(this.previousUnit.prevUnitProps.name, "shot", name, id);
				this.reduceAction(2,"previous");
			}
		}
	}
	
	attackAlly(unit) {
		//Cf. attackEnemy function
		//TO WORK: revise movesTowardAlly() so that it doesn't run if it's next to an ally - fights with melee instead
		if (unit && !this.state.playerTurn) {
			console.log("attackAlly");
			//console.log(unit);

			var meleeUnits = this.enemyTeamUnits.meleeUnits;

			if (meleeUnits.length > 0) {
				for (let i=0; i<meleeUnits.length; i++) {
					if (meleeUnits[i]['speed'] > 0) {
						this.selectedArenaUnit.selectUnitProps = meleeUnits[i];
					}
				}
			}

			var enemyUnitProps = this.selectedArenaUnit.selectUnitProps;
			// console.log(enemyUnitProps.id, "XY", enemyUnitProps.xPos, enemyUnitProps.yPos, "speed", enemyUnitProps.speed);

			// Compare enemy unit's position to ally's for adjacency
			function calculateAdjacency(enemyX, enemyY, enemyID, allyID) {
				if (unit.xPos && unit.yPos) {
					if (Math.abs(enemyY - unit.yPos) <= 1 && Math.abs(enemyX - unit.xPos) <= 1) {
						return true;
					}

				} else {
					if (Math.abs(enemyY - unit.initY) <= 1 && Math.abs(enemyX - unit.initX) <= 1) {
						return true;
					}

				}
			}

			if (calculateAdjacency(enemyUnitProps.xPos, enemyUnitProps.yPos, enemyUnitProps.id, unit.id) ) {
				console.log("Adjacent", enemyUnitProps.id, unit.id)
				console.log("Attacker Id:", this.selectedArenaUnit.selectUnitProps.id, "number", this.selectedArenaUnit.selectUnitProps.no, "melee", this.selectedArenaUnit.selectUnitProps.melee, "defense", this.selectedArenaUnit.selectUnitProps.defense);
				console.log(unit.id, unit.totalHP, unit.defense, unit.melee, unit.no);
				this.props.dispatch(attackEnemy(this.selectedArenaUnit.selectUnitProps.id, this.selectedArenaUnit.selectUnitProps.totalHP, this.selectedArenaUnit.selectUnitProps.melee, this.selectedArenaUnit.selectUnitProps.no, this.selectedArenaUnit.selectUnitProps.defense, unit.id, unit.totalHP, unit.defense, unit.melee, unit.no) );
				this.reduceAction(2,"current");
			}
		}
	}

	enemySpace(square, id) {
		
		//var allOccupied = this.allyCalculations.allOccupied;
		var match = false;
		var index = 0;

		if (square) {
			for (let i=0; i<this.allyCalculations.allOccupied.length; i++) {
				if (id === this.allyCalculations.allOccupied[i][0]) {
					match = true;
					index = i;
				}
			}

			//Store the occupied coordinates into the allOccupied property
			if (!match) {
				this.allyCalculations.allOccupied.push([id, square.xCoord, square.yCoord]);
			} else {
				this.allyCalculations.allOccupied.splice(index, 1, [id, square.xCoord, square.yCoord]);
			}
		}
	}

	movesTowardAlly(unit) {
		// TO WORK: this should run only if not contiguous with ally
		if (unit && !this.state.playerTurn) {
			//console.log(unit.id);
			//console.log(this.allyCalculations);

			//TO WORK: this.allyCalculations.rankAllyHp needs a lot of repair, it gets duplicates
			//Should the target ally units be sorted again? They don't seem to be running after shootAlly

			var meleeUnits = this.enemyTeamUnits.meleeUnits;

			if (meleeUnits.length > 0) {
				for (let i=0; i<meleeUnits.length; i++) {
					if (meleeUnits[i]['speed'] > 0) {
						this.selectedArenaUnit.selectUnitProps = meleeUnits[i];
					}
				}
			}

			var enemyUnitProps = this.selectedArenaUnit.selectUnitProps;

			var distance = 0;
			var distanceCoords = [];

			// console.log(enemyUnitProps.id, "XY", enemyUnitProps.xPos, enemyUnitProps.yPos, "speed", enemyUnitProps.speed);

			function calculateDistance(enemyX, enemyY) {
				if (unit.xPos && unit.yPos) {
					if (Math.abs(enemyY - unit.yPos) > Math.abs(enemyX - unit.xPos) ) {
						// console.log("The Y distance is greater");
						distance = Math.abs(enemyX - unit.xPos);
						// console.log("distance", distance);
						distanceCoords.push([distance, enemyX, enemyY]);
					} else {
						// console.log("The X distance is greater");
						distance = Math.abs(enemyY - unit.yPos);
						// console.log("distance", distance);
						distanceCoords.push([distance, enemyX, enemyY]);
					}
				} else {
					// console.log(unit.initX, unit.initY);
					// console.log(Math.abs(enemyX - unit.initX), Math.abs(enemyY - unit.initY));
					if (Math.abs(enemyY - unit.initY) > Math.abs(enemyX - unit.initX) ) {
						// console.log("The Y distance is greater");
						distance = Math.abs(enemyX - unit.initX);
						// console.log("distance", distance);
						distanceCoords.push([distance, enemyX, enemyY]);
					} else {
						// console.log("The X distance is greater");
						distance = Math.abs(enemyY - unit.initY);
						// console.log("distance", distance);
						distanceCoords.push([distance, enemyX, enemyY]);
					}

				}
			}

			calculateDistance(enemyUnitProps.xPos, enemyUnitProps.yPos);

			var enemyPositions = this.enemyPositions;
			var coordArray = [];

			//If absolute value of square distance x <= 1 && absolute value of distance y <= 1, push to coordArray
			//Compare the X coordinates to the unit's
			for (let i=0; i<16; i++) {
				//Compare the Y coordinates to the unit's
				for (let j=0; j<16; j++) {
					if (enemyUnitProps.speed > 0 && enemyUnitProps.totalHP > 0) {
						if (Math.abs(enemyUnitProps.xPos - i) <= 1 && Math.abs(enemyUnitProps.yPos - j) <= 1) {
							coordArray.push([i,j]);
						}
						//start from initialized positions if unit's xPos and yPos haven't been yet set
					} else {
						if (Math.abs(enemyUnitProps.initX - i) <= 1 && Math.abs(enemyUnitProps.initY - j) <= 1) {
							coordArray.push([i,j]);
						}
					}
				}
			}

			//Check which squares are open for movement
			this.enemySpace();

			//console.log(this.allyCalculations.allOccupied);

			if (coordArray.length > 0) {
				console.log(coordArray.length);
				for (let i=0; i<coordArray.length; i++) {
					console.log(coordArray[i]);
					for (let j=0; j<this.allyCalculations.allOccupied.length; j++) {
						if (coordArray[i] && coordArray[i][0] === this.allyCalculations.allOccupied[j][1] && coordArray[i][1] === this.allyCalculations.allOccupied[j][2]) {
							console.log(coordArray[i]);
							coordArray.splice(i, 1);
						}
					}
				}
			}

			for (let i=0; i<coordArray.length; i++) {
				// console.log(coordArray[i]);
				calculateDistance(coordArray[i][0],coordArray[i][1]);
			}

			function sortByDistance(a, b) {
				return a[0] - b[0];
			}

			distanceCoords.sort(sortByDistance);
			// console.log(unit.id, "Square to shortest distance", distanceCoords[0][0], distanceCoords[0][1]);

			var updateCoords = this.state.enemyOccPos;
			
			for (let i=0; i<this.state.enemyOccPos.length; i++) {
				if (this.state.enemyOccPos[i][0] == enemyUnitProps.xPos && this.state.enemyOccPos[i][1] == enemyUnitProps.yPos) {
					// console.log("coords match");
					// console.log(selectedX,selectedY);
					this.occPosIndex = i;
				}
			}

			// console.log("Array position from THIS", this.occPosIndex);

			//Update the enemy units' respective coordinates to advance movement
			if (enemyUnitProps.speed > 0) {
				updateCoords.splice(this.occPosIndex, 1, [distanceCoords[0][0], distanceCoords[0][1] ]);
				this.setState({enemyOccPos:updateCoords});
				this.reduceAction(1,"current");
			}

		} //Closes the if (unit) condition required for the operations
	}

	assessAllyUnit(unit){
		//Enemy side calls this function to access ally stats for calculations
		// console.log(unit.initHP, unit.id);

		//List the allies
		var idInAllyList = false;
		var duplicateId = "";

		function sortByHP(a, b) {
			return a[0] - b[0];
		}

		if (unit) {

			//TO WORK: This is assigning previous health points to newly clicked units, which is killing them
			for (let i=0; i<this.allyCalculations.rankAllyHp.length; i++) {
				//console.log(unit.id, i);
				if (unit.id === this.allyCalculations.rankAllyHp[i][1] && unit.totalHP === this.allyCalculations.rankAllyHp[i][0]) {
					idInAllyList = true;
					duplicateId = unit.id;
				} else if (unit.id === this.allyCalculations.rankAllyHp[i][1] && unit.totalHP !== this.allyCalculations.rankAllyHp[i][0]) {
					//Replace the unit's index with updated stats if its health points have been modified
					this.allyCalculations.rankAllyHp.splice(i, 1, [unit.totalHP, unit.id]);
				}
			}
			if (!idInAllyList && duplicateId === "") {
				this.allyCalculations.rankAllyHp.push([unit.totalHP, unit.id]);
			}
			this.allyCalculations.rankAllyHp.sort(sortByHP);

			//Prioritize the target allies by current totalHP and/or speed
			var highestHP;
			if (this.allyCalculations.rankAllyHp.length > 0) {
				for (let i=0; i<this.allyCalculations.rankAllyHp.length; i++) {
					if (this.allyCalculations.rankAllyHp[i][0] > 0) {
						highestHP = this.allyCalculations.rankAllyHp[i];
					}
				}
				//Select one target at a time until it's dead
			}
			if (highestHP) {
				this.allyCalculations.allyTargetId = highestHP[1];
			}
		}
	}

	componentDidMount() {
		console.log(this.props.playerTeam);
		// axios.post("/enemies/" + this.props.playerTeam).then(function(response) {
		axios.get("/enemies").then(function(response) {
			var teamlength = response.data.enemyteam.length;
			var movesArray = [];
			for (let i=0; i<teamlength; i++) {
				movesArray.push([response.data.enemyteam[i]['_id'] + "EN" + [i], response.data.enemyteam[i]['speed']]);
				this.reset.initEnemyMoves.push([response.data.enemyteam[i]['_id'] + "EN" + [i], response.data.enemyteam[i]['speed']]);
			}
			this.setState({ 
				enemies:response.data.enemyteam,
				enemyMoves:movesArray
			});
			this.props.enemySide(response.data.team);
		}.bind(this) );
		// axios.post("/team/" + this.props.playerTeam).then(function(response) {
		axios.get("/allies").then(function(response) {
			var teamlength = response.data.enemyteam.length;
			var movesArray = [];
			for (let i=0; i<teamlength; i++) {
				movesArray.push([response.data.enemyteam[i]['_id'] + "AL" + [i], response.data.enemyteam[i]['speed']]);
				this.reset.initAllyMoves.push([response.data.enemyteam[i]['_id'] + "AL" + [i], response.data.enemyteam[i]['speed']]);
			}
			this.setState({ 
				allies: response.data.enemyteam,
				allyMoves: movesArray
			});
			this.props.allySide(response.data.team);
		}.bind(this) );

	}

	componentDidUpdate(prevProps, prevState) {
		//TO WORK: will this be necessary? It could be removed
		if (prevProps.movesUnitId !== this.state.prevUnit) {
			this.setState({prevUnit:prevProps.movesUnitId});
			// console.log(prevProps);
			// console.log(prevState);
		}

		if (!this.state.playerTurn) {
			this.shootAlly();
			this.movesTowardAlly();
			this.attackAlly();
		}

		this.assessAllyUnit();

		var counter = 0;
		var startedCounter = false;
		if (this.state.playerTurn) {
			//Initialize a counter
			var remainingAllyMoves = this.state.allyMoves;
			for (let i=0; i<remainingAllyMoves.length; i++) {
				if (remainingAllyMoves[i][1] > 0) {
					counter += 1;
					startedCounter = true;
				}
			}
			if (counter > 0) {
				console.log(counter,"Units with moves left");
			}

			if (counter === 0 && startedCounter) {
				console.log("No moves left!");
				this.setState({ playerTurn: false });
				this.props.enemyTurn();
			}
		} else if (!this.state.playerTurn) {
			var remainingEnemyMoves = this.state.enemyMoves;
			for (let i=0; i<remainingEnemyMoves.length; i++) {
				if (remainingEnemyMoves[i][1] > 0) {
					counter += 1;
					startedCounter = true;
				}
			}
			if (counter > 0) {
				console.log(counter,"Units with moves left");
			}

			if (counter === 0 && startedCounter) {
				console.log("No moves left!");
				this.setState({ playerTurn: true });
			}
		}
		//console.log(this.targetSquares);
		if (this.reset.speed) {
			console.log("Reset speed");
			console.log(this.reset.initEnemyMoves);
			console.log(this.reset.initAllyMoves);
			this.setState({
				enemyMoves: this.reset.initEnemyMoves,
				allyMoves: this.reset.initAllyMoves,
			});
			this.reset.speed = false;
		}
	}

	componentWillReceiveProps(newProps) {
		// console.log("State from CWRP");

		// console.log("Player's turn", this.state.playerTurn);
		if (newProps.movesUnitId !== this.state.newUnit) {
			//this.setState({newUnit:newProps.movesUnitId});
			//When the new unit is clicked, the previousUnitXY is assigned to it, not the previous unit
			//this.setState({previousUnitXY:newProps.prevXY});
		}
		//This is the current unit

		//TO WORK: the blood and elemental magics could target either enemy or ally, this will require refinement
		if (this.props.cursorIcon === 'life_magic') {
			this.setState({
				cursorAlly:this.props.cursorIcon,
				actionIsSelected: true
			});
		} else if (newProps.cursorIcon === 'death_magic' || newProps.cursorIcon === 'blood_magic' || newProps.cursorIcon === 'nature_magic') {
			this.setState({
				//The cursor is getting updated first because it is clicked first
				//TO WORK: Then the selectedSpell remains the previous, this state needs to be set elsewhere
				cursorEnemy:this.props.cursorIcon,
				actionIsSelected: true
			});
		}

		//Keep the cursor set to default only if another unit hasn't been selected
		else if (newProps.cursorIcon === '' && this.selectedArenaUnit.selectUnit === false) {
			this.setState({
				cursorEnemy: "",
				cursorAlly: ""
			}, function() {
				//console.log("Cursor should be reset");
			});
		}

		if (newProps.selectedSpell !== "") {
			this.arenaAction.selectedSpell = newProps.selectedSpell;
			this.arenaAction.spellCost = newProps.spellCost;
			//this.setState({ selectedSpell:newProps.selectedSpell });
		} else {
			this.arenaAction.selectedSpell = "";
			//this.setState({ selectedSpell: "" });
		}

		//TO WORK: set state for clicked enemy id, passed as props from getUnitInfo function in PlayField
		//Will this be necessary? Could be removed
		this.setState({
			selectedUnitId: newProps.unitId,
			selectedUnitHP: newProps.totalHP,
			unitIsAffected: newProps.unitIsAffected,
			playerTurn: newProps.playerTurn
		});

		if (newProps.waitClicked) {
			console.log("WAIT button");
			this.setState({waitClicked: true});
		} else {
			this.setState({waitClicked: false});
		}

		if (newProps.resetSpeed) {
			this.reset.speed = true;
		}

		console.log(newProps);
		//console.log(this.previousUnit);

	}

	componentWillUpdate(update) {
	}

	//Adopted from https://gaearon.github.io/react-dnd/docs-tutorial.html
	//TO WORK : reset the available moves after both teams have turned
	renderSquare(i) {
		//console.log(this.props.tahuiSpell);

		var x = i % 16;
		var y = Math.floor(i / 16);
		
		//var enemyArr = this.enemyPositions;
		var enemyArr = this.state.enemyOccPos;
		var allyArr = this.state.allyOccPos;
		var enemyMovesArr = this.state.enemyMoves;
		var allyMovesArr = this.state.allyMoves;
		var currStats = this.props.getUnitInfo;
		var playerTurn = this.state.playerTurn;

		var updateCoords = this.state.allyOccPos;
		var index = this.state.occPosIndex;

		var emptySquare = this.emptySquare;
		var available = this.available;
		var enemies = this.state.enemies;
		var allies = this.state.allies;

		//Selected unit props
		var selectUnit = this.selectedArenaUnit.selectUnit;
		var propsUnitId = this.selectedArenaUnit.selectedUnitId;
		var unitIsSelected = this.state.unitIsSelected;
		var movesLeft = this.selectedArenaUnit.selectUnitProps.speed;
		var waitClicked = this.state.waitClicked;
		var cursorEnemy = this.state.cursorEnemy;
		var cursorSword = this.state.cursorSword;
		var cursorAlly = this.state.cursorAlly;
		var getUnit = this.getUnit;

		//Selected unit coordinates
		var selectedUnitX;
		var selectedUnitY;
		if (this.selectedArenaUnit.selectUnitProps.xPos && this.selectedArenaUnit.selectUnitProps.yPos) {
			selectedUnitX = this.selectedArenaUnit.selectUnitProps.xPos;
			selectedUnitY = this.selectedArenaUnit.selectUnitProps.yPos;
		} else {
			selectedUnitX = this.selectedArenaUnit.selectUnitProps.initX;
			selectedUnitY = this.selectedArenaUnit.selectUnitProps.initY;
		}

		//The previous unit props
		var prevId = this.props.prevId;
		var prevHp = this.props.prevHp;
		var ammo = this.props.ammo;
		var magic = this.props.magic;

		//TO WORK: Are these necessary?
		var previousUnitXY = this.state.previousUnitXY;
		var newUnit = this.state.newUnit;
		var previousCoords = this.previousCoords;
		var prevUnit = this.state.prevUnit;

		//Movement and action
		var moveToXY = this.moveToXY;
		var reduceAction = this.reduceAction;
		var projectile = this.projectile;
		var melee = this.melee;
		var spellIcon = this.spellIcon;
		var actionIsSelected = this.state.actionIsSelected;
		var isEmpty = this.state.empty;
		var neighborCoords = this.arenaAction.neighborCoords;
		var resetSelection = this.resetSelection;
		var shootEnemy = this.shootEnemy;
		var attackEnemy = this.attackEnemy;

		//Affected unit properties
		var affectedUnitId = this.state.selectedUnitId;
		var unitIsAffected = this.state.unitIsAffected;
		var newHP = this.props.totalHP;
		//This one may be removed if the former could apply to both ally and enemy units
		var totalHP = this.state.selectedUnitHP;
		var tahuiRanged = this.props.ranged;

		//Properties for enemy team's calculations
		var enemyMovesLeft = this.props.speed;
		var currentEnemyId = this.previousUnit.prevUnitProps.id
		var sortEnemyUnits = this.sortEnemyUnits;
		var attackAlly = this.attackAlly;
		var shootAlly = this.shootAlly;
		var movesTowardAlly = this.movesTowardAlly;
		var enemySpace = this.enemySpace;
		var assessAllyUnit = this.assessAllyUnit;
		var allyTargetId = this.allyCalculations.allyTargetId;

		//Elemental spells
		var damageSpell = this.damageSpell;

		//Blood spells
		var tahui = this.tahui;
		var tahuiSpell = this.props.tahuiSpell;

		var availableSquares = this.targetSquares;
		var isOpen = false;

		for (let j=0; j<availableSquares.length; j++) {
			if (x === availableSquares[j][0] && y === availableSquares[j][1] && movesLeft > 0) {
				//TO WORK: this is being passed to the Square component, but only through the render
				isOpen = true;
				//console.log(x,y,isOpen);
			}
		}

		var enemyPos = enemies.map(function(unit,inc){

			unit.id = unit._id + "EN" + inc;

			//Initialize the unit's speed, which will be automatically reset and/or magically manipulated for next turn
			var initSpeedArr = enemyMovesArr;
			for (let i=0; i<initSpeedArr.length; i++) {
				if (unit.id === initSpeedArr[i][0]) {
					unit.speed = initSpeedArr[i][1];
				}
			}
			unit.initSpeed = unit.speed;

			if (!unit.affected) {
				//Initialize the unit's total health points: hp times number
				unit.initHP = unit.no * unit.hp;
				unit.totalHP = unit.initHP;
			}
			if (unitIsAffected && unit.id === affectedUnitId) {
				unit.affected = true;
				unit.totalHP = totalHP;

				if (unit.totalHP % unit.hp === 0 && unit.totalHP > 0) {
					unit.no = unit.totalHP / unit.hp;
				} else if (unit.totalHP % unit.hp !== 0 && unit.totalHP > 0) {
					unit.no = Math.floor(unit.totalHP / unit.hp) + 1;
				} else if (unit.totalHP <= 0) {
					unit.speed = 0;
				}
			}

			if (unit.id === currentEnemyId) {
				unit.affected = true;
				if (actionIsSelected) {
					unit.totalHP = prevHp;
				}
				unit.ammo = ammo;
				unit.magic = magic;

				if (enemyMovesLeft >= 0) {
					unit.speed = enemyMovesLeft;
				}

			}

			//Produce ally property for enemy units because this can be toggled with the teixcuepa spell
			unit.ally = false;

			var enemyProps = {
				playerTurn: playerTurn,
				sortEnemyUnits: sortEnemyUnits,
				getUnitInfo: currStats,
				unitProps: unit,
				key: unit.id,
				id: unit.id,
				unitHeight: 70,
				unitWidth: 70,
				responsive: "img-responsive",
				style: {margin: "auto"},
				damageSpell: damageSpell,
				cursorEnemy: cursorEnemy,
				getUnit: getUnit,
				unitIsSelected: unitIsSelected,
				resetSelection: resetSelection,
				unitHP: totalHP,
				shootEnemy: shootEnemy,
				reduceAction: reduceAction,
				attackEnemy: attackEnemy,
				neighborCoords: neighborCoords,
				cursorSword: cursorSword				
			};

			if (x === enemyArr[inc][0] && y === enemyArr[inc][1]) {
				//IF initial positions, these won't apply if unit is selected
				unit.xPos = enemyArr[inc][0];
				unit.yPos = enemyArr[inc][1];
				return <Enemy {...enemyProps} />
			} else {
				return null;
			}
		});
		
		if (this.state.unitX !== -1 && this.state.unitY !== -1 && isEmpty === true) {
			var newPosX = this.state.unitX;
			var newPosY = this.state.unitY;
		}

		var allyPos = allies.map(function(unit,inc){

			//Initialize the unit's total health points: hp times number
			if (!unit.affected) {
				unit.initHP = unit.no * unit.hp;
				unit.totalHP = unit.initHP;
			}

			unit.id = unit._id + "AL" + inc;

			//Initialize the unit's speed, which will be automatically reset and/or magically manipulated for next turn
			var initSpeedArr = allyMovesArr;
			for (let i=0; i<initSpeedArr.length; i++) {
				if (unit.id === initSpeedArr[i][0]) {
					unit.speed = initSpeedArr[i][1];
				}
			}
			unit.initSpeed = unit.speed;

			unit.initX = allyArr[inc][0];
			unit.initY = allyArr[inc][1];

			unit.ally = true;

			if (unit.id === prevId) {
				unit.affected = true;
				unit.totalHP = prevHp;
				unit.ammo = ammo;
				unit.magic = magic;

				if (unit.totalHP % unit.hp === 0 && unit.totalHP > 0) {
					unit.no = unit.totalHP / unit.hp;
				} else if (unit.totalHP % unit.hp !== 0 && unit.totalHP > 0) {
					unit.no = Math.floor(unit.totalHP / unit.hp) + 1;
				}
			}

			if (unitIsAffected && unit.id === allyTargetId) {
				unit.affected = true;
				unit.totalHP = newHP;

				if (unit.totalHP % unit.hp === 0 && unit.totalHP > 0) {
					unit.no = unit.totalHP / unit.hp;
				} else if (unit.totalHP % unit.hp !== 0 && unit.totalHP > 0) {
					unit.no = Math.floor(unit.totalHP / unit.hp) + 1;
				}
			}

			//If unit has projectile ammo and hasn't already received the tahui spell, it can
			if (unit.ammo > 0 && !unit.tahuiSpell) {
				unit.tahuiSpell = false;
			}

			var allyProps = { 
				playerTurn: playerTurn,
				getUnitInfo : currStats,
				emptySquare : emptySquare,
				unitProps : unit,
				projectile : projectile,
				melee: melee,
				spellIcon: spellIcon,
				cursorAlly: cursorAlly,
				key : unit.id,
				id : unit.id,
				unitHeight : 70,
				unitWidth : 70,
				responsive : "img-responsive",
				style : {margin:"auto"},
				tahui : tahui,
				getUnit : getUnit,
				previousCoords : previousCoords,
				updateCoords : updateCoords,
				unitIsSelected : unitIsSelected,
				waitClicked: waitClicked,
				resetSelection : resetSelection,

				//Properties for enemy to calculate moves
				attackAlly: attackAlly,
				shootAlly: shootAlly,
				movesTowardAlly: movesTowardAlly,
				assessAllyUnit: assessAllyUnit,
				allyTargetId: allyTargetId,

				//Props from the constructor objects
				//It might not be necessary to pass selectUnit to Ally props
				//Could remove
				selectUnit : selectUnit,
				propsUnitId : propsUnitId
			};

			/*
			var nextAllyProps = getAllyProps(this.props, this.state)
			...
			return <Ally {...nextAllyProps} />
			*/
			//Temporary, to check unit properties
			if (x === allyArr[inc][0] && y === allyArr[inc][1]) {

			}

			//Default position for unmoved units
			//Replaced the unit.id !== currentUnitId for all conditions --> prevUnit !== newUnit
			if (x === allyArr[inc][0] && y === allyArr[inc][1] && unit.id !== newUnit && !unit.moved) {
				return <Ally {...allyProps} />

				console.log("1: This is from the default position");
				console.log("unit.id ",unit.id);
				console.log("propsUnitId ", propsUnitId);
				console.log("prevUnit ", prevUnit);
				//console.log("newUnit ",newUnit);
				console.log(previousUnitXY[0],previousUnitXY[1]);
				console.log(updateCoords);

			}

			//Keeps the selected unit visible even it not yet moved
			else if (x === allyArr[inc][0] && y === allyArr[inc][1] && unit.id === newUnit && !unit.moved) {
				unit.moved = true;

				//Passing the values from the tahui function
				unit.ranged = tahuiRanged;
				unit.tahuiSpell = tahuiSpell;

				console.log("2: Unit visible even if not yet moved");
				console.log("unit.id ",unit.id);
				console.log("propsUnitId ", propsUnitId);
				console.log("prevUnit ", prevUnit);
				//console.log("newUnit ",newUnit);
				console.log(previousUnitXY[0],previousUnitXY[1]);
				console.log(updateCoords);

				return <Ally {...allyProps} />
			}

			//Keep moved units at their current positions
			//Frozen units are calling this condition
			else if (x === unit.xPos && y === unit.yPos && unit.moved) {

				if (movesLeft >= 0) {
					unit.speed = movesLeft;
				}

				console.log("3: Unit moved and kept in current position");
				console.log("unit.id ",unit.id);
				console.log("propsUnitId ", propsUnitId);
				console.log("prevUnit ", prevUnit);
				//console.log("newUnit ",newUnit);
				console.log(previousUnitXY[0],previousUnitXY[1]);
				console.log(updateCoords);

				//TO WORK: add a new condition here to indicate newly moved unit

				return <Ally {...allyProps} />
			}

			// removed conditions && unit.id === currentUnitId && prevUnit !== currentUnitId
			//newPosX and newPosY aren't getting called because they are undefined outside the conditional
			else if (x === newPosX && y === newPosY && unit.id === propsUnitId && prevUnit !== propsUnitId) {
				console.log("4: Prevent unit from replacing another");
				console.log("unit.id ",unit.id);
				console.log("propsUnitId ", propsUnitId);
				console.log("prevUnit ", prevUnit);
				// console.log("newUnit ",newUnit);
				console.log(previousUnitXY[0],previousUnitXY[1]);
				console.log(updateCoords);

				for (let i=0; i<updateCoords.length; i++) {

					if (x === updateCoords[i][0] && y === updateCoords[i][1]) {
						console.log("This space is already occupied!");
						console.log(x, y);
						console.log(previousUnitXY[0],previousUnitXY[1]);

						//Reset the values to their original coordinates: previousUnitXY[0], previousUnitXY[1]
						unit.xPos = previousUnitXY[0];
						unit.yPos = previousUnitXY[1];
						unit.moved = false;
					} else {
						//Make the move
						unit.xPos = newPosX;
						unit.yPos = newPosY;
						unit.moved = true;

						//updateCoords.push([newPosX,newPosY]);
						//this.setState({allyOccPos:updateCoords});

						console.log("Unit moved");
					}
					// line 237 commented out, the ally positions already updated before this comparison can be made
				}

				//Nullify the initial positions so the image isn't re-rendered at its original location
				unit.initX = null;
				unit.initY = null;

				if (movesLeft >= 0) {
					unit.speed = movesLeft;
				}

				//Passing the values from the tahui function
				unit.ranged = tahuiRanged;
				unit.tahuiSpell = tahuiSpell;
				
				return <Ally {...allyProps} />
			}

			else {
				return null;
			}
		});
		
		//Pass the updateCoords to the Square for clicked square to compare coordinates
		//before accessing the moveToXY() function
		return (
			<div key={i} style={{ width: '6.25%', height: '6.25%' }}>
				<Square xCoord={x} yCoord={y} isOpen={isOpen} boardSquare={'boardSquare'} cursorEnemy={cursorEnemy}
				available={available} moveToXY={moveToXY} reduceAction={reduceAction} unitIsSelected={unitIsSelected}
				resetSelection={resetSelection} enemySpace={enemySpace}
				//TO WORK: these may be removed
				selectedUnitX={selectedUnitX} selectedUnitY={selectedUnitY} movesLeft={movesLeft}
				>
					{enemyPos}
					{allyPos}
				</Square>
			</div>
		);
	}

	render() {

		// console.log(this.arenaAction);
		// console.log(this.previousUnit);
		// console.log(this.selectedArenaUnit);
		// console.log(this.props);
		// console.log(this.state);
		// console.log(this.state.selectedUnitId);
		// console.log(this.props.unitIsAffected);
		// console.log(this.allyCalculations.rankAllyHp);
		// console.log(this.state.playerTurn);
		// console.log(this.enemyTeamUnits.projectileUnits);
		// console.log(this.enemyTeamUnits.meleeUnits);
		// console.log(this.allyCalculations.allyTargetId);
		console.log(this.reset.initAllyMoves);
		// console.log(this.reset.initEnemyMoves);

		var squares = [];
		for (let i = 0; i < 256; i++) {
			squares.push(this.renderSquare(i));
		}

		return (
			<div style={{
			width: '100%',
			height: '100%',
			display: 'flex',
			flexWrap: 'wrap'
			}}
			>
				{squares}
			</div>
		);
	}

};