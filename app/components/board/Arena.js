var React = require("react");
var axios = require("axios");

var Square = require("./Square");
var Enemy = require("../units/Enemy");
var Ally = require("../units/Ally");

class Arena extends React.Component{

	constructor() {
		super();
		this.state = {
			enemyPositions: [
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
			],
			allyPositions: [
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
			unitX: -1,
			unitY: -1,
			empty: true,
			selectedUnitId: "",
			movesLeft: -1,
			targetSquares: [],
			enemies: [],
			allies: [],
			cursorImage: ""
		};
		this.emptySquare = this.emptySquare.bind(this);
		this.available = this.available.bind(this);
		this.moveToX = this.moveToX.bind(this);
		this.moveToY = this.moveToY.bind(this);
		this.reduceAction = this.reduceAction.bind(this);
		this.projectile = this.projectile.bind(this);
	}

	emptySquare(open) {
		console.log(open);

		var coordArray = [];
		if (open.ally) {
			//If absolute value of square distance x <= 1 && absolute value of distance y <= 1, push to coordArray
			//! the idea is to mark available spaces with a footprint, but for now at least a highlight

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
			this.setState({
				targetSquares: coordArray,
				selectedUnitId: open.id,
				movesLeft: open.speed,
				unitX: selectedX,
				unitY: selectedY
			});
		}
	}

	//if selectedUnitId isn't "", it has projectile weapons, and square has enemy Image, onClick (on unit image?) to attack

	//if selectedUnitId isn't "", it has passive abilities, and square has ally Image, onClick (on unit image?) to affect

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

	moveToX(unit) {
		if (unit.length > 0) {
			var squareCoord = unit.split(",").map(Number);

			if (squareCoord[0] !== this.state.unitX || squareCoord[1] !== this.state.unitY) {
				this.setState({unitX:squareCoord[0]});
			}
		}
	}

	moveToY(unit) {
		if (unit.length > 0) {
			var squareCoord = unit.split(",").map(Number);
			if (squareCoord[0] !== this.state.unitX || squareCoord[1] !== this.state.unitY) {
				this.setState({unitY:squareCoord[1]});
			}
		}
	}

	//Speed is a condition: if speed > 0, actions are still available; else no more are permissible
	reduceAction(unit) {
		//If movement, reduce by 1; if attack, reduce by 2
		if (this.state.movesLeft > 0) {
			var reduceAction = this.state.movesLeft - 1;
			this.setState({movesLeft: reduceAction});
		}
	}

	projectile(unit) {
		console.log(unit.ammo);
		if (unit.ranged > 0) {
			this.setState({cursorImage: "spears"});
		}
		//Condition to select muwieri or spear cursor depending whether attack is magic or ranged
	}

	componentDidMount() {
		axios.get("/enemies").then(function(response) {
			this.setState({enemies:response.data.enemyteam});
		}.bind(this) );
		axios.get("/allies").then(function(response) {
			this.setState({allies:response.data.enemyteam});
		}.bind(this) );
	}

	//Adopted from https://gaearon.github.io/react-dnd/docs-tutorial.html
	//TO WORK : reset the available moves after both teams have turned
	renderSquare(i) {
		var x = i % 16;
		var y = Math.floor(i / 16);

		var enemyArr = this.state.enemyPositions;
		var allyArr = this.state.allyPositions;
		var currStats = this.props.getUnitInfo;
		var emptySquare = this.emptySquare;
		var available = this.available;
		var enemies = this.state.enemies;
		var allies = this.state.allies;
		var currentUnit = this.state.selectedUnitId;
		var movesLeft = this.state.movesLeft;
		var cursorImage = this.state.cursorImage;

		var moveToX = this.moveToX;
		var moveToY = this.moveToY;
		var reduceAction = this.reduceAction;
		var projectile = this.projectile;

		var availableSquares = this.state.targetSquares;
		var isOpen = false;
		
		for (let j=0; j<availableSquares.length; j++) {
			if (x === availableSquares[j][0] && y === availableSquares[j][1] && movesLeft > 0) {
				//console.log(x,y);
				isOpen = true;
			}
		}

		var enemyPos = enemies.map(function(unit,inc){
			unit.id = unit._id + inc;
			if (x === enemyArr[inc][0] && y === enemyArr[inc][1]) {
				//IF initial positions, these won't apply if unit is selected
				unit.xPos = enemyArr[inc][0];
				unit.yPos = enemyArr[inc][1];
				return <Enemy getUnitInfo={currStats} unitProps={unit} key={unit.id} id={unit.id} unitHeight={70} unitWidth={70} responsive={"img-responsive"} style={{margin: "auto"}} />
			} else {
				return null;
			}
		});

		var currentUnitId = this.state.selectedUnitId;

		if (this.state.unitX !== -1 && this.state.unitY !== -1) {
			var newPosX = this.state.unitX;
			var newPosY = this.state.unitY;
		}

		var allyPos = allies.map(function(unit,inc){
			unit.id = unit._id + inc;

			unit.initX = allyArr[inc][0];
			unit.initY = allyArr[inc][1];

			unit.ally = true;

			//Default position for unmoved units
			if (x === allyArr[inc][0] && y === allyArr[inc][1] && unit.id !== currentUnitId && !unit.moved) {
				return <Ally getUnitInfo={currStats} emptySquare={emptySquare} unitProps={unit} projectile={projectile} key={unit.id} id={unit.id} unitHeight={70} unitWidth={70} responsive={"img-responsive"} style={{margin:"auto"}} />
			}

			//Keeps the selected unit visible even it not yet moved
			else if (x === allyArr[inc][0] && y === allyArr[inc][1] && unit.id === currentUnitId && !unit.moved) {
				unit.moved = true;
				return <Ally getUnitInfo={currStats} emptySquare={emptySquare} unitProps={unit} projectile={projectile} key={unit.id} id={unit.id} unitHeight={70} unitWidth={70} responsive={"img-responsive"} style={{margin:"auto"}} />
			}

			//Keep moved units at their current positions
			else if (x === unit.xPos && y === unit.yPos && unit.moved) {

				//TO WORK: Reduce the number of unit's available moves
				if (movesLeft >= 0) {
					unit.speed = movesLeft;
				}				
				return <Ally getUnitInfo={currStats} emptySquare={emptySquare} unitProps={unit} projectile={projectile} key={unit.id} id={unit.id} unitHeight={70} unitWidth={70} responsive={"img-responsive"} style={{margin:"auto"}} />
			}

			else if (x === newPosX && y === newPosY && unit.id === currentUnitId) {
				//Nullify the initial positions so the image isn't re-rendered at its original location
				unit.initX = null;
				unit.initY = null;
				unit.xPos = newPosX;
				unit.yPos = newPosY;
				unit.moved = true;
				if (movesLeft >= 0) {
					unit.speed = movesLeft;
				}
				return <Ally getUnitInfo={currStats} xPos={newPosX} yPos={newPosY} emptySquare={emptySquare} unitProps={unit} projectile={projectile} key={unit.id} id={unit.id} unitHeight={70} unitWidth={70} responsive={"img-responsive"} style={{margin:"auto"}} />
			}

			else {
				return null;
			}
		});
		
		return (
			<div key={i} style={{ width: '6.25%', height: '6.25%' }}>
				<Square xCoord={x} yCoord={y} isOpen={isOpen} boardSquare={'boardSquare'} cursorImage={cursorImage} available={available} moveToX={moveToX} moveToY={moveToY} reduceAction={reduceAction}>
					{enemyPos}
					{allyPos}
				</Square>
			</div>
		);
	}

	render() {

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

	componentDidUpdate(prevState, currState) {
		//prevState is getting only the getUnitInfo reference, which is passed from PlayField parent component

		// console.log(currState);
		// console.log(this.state);
	}

};

module.exports = Arena;

//style={{position:"absolute"}}