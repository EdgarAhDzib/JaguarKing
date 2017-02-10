var React = require("react");

class Square extends React.Component{
	
	constructor() {
		super();
		//This might work better as props instead of state
		this.state = {
			empty: true,
			isSelected: false,
		};
		this.handleClick = this.handleClick.bind(this);
		this.openSquare = {open: false};
	}

	componentWillReceiveProps(newProps) {
		var occSquareArray = [];
		for (var i=0; i<12; i++) {
			if (this.props.children[0][i] != null || this.props.children[1][i] != null) {
				//Only the last unit was getting the changed state until the else condition was removed
				//Will this be necessary?
				this.setState({empty:false});

				//Create an array of the occupied squares and pass them into function occupiedSquares() in Arena
				//occSquareArray.push([this.props.xCoord, this.props.yCoord]);
			}
		}
		//this.props.occupiedSquares(occSquareArray);
	}

	handleClick(event) {
		if (event.target.getAttribute('class') === "boardSquare availableSquare") {
			var squareId = event.target.getAttribute('id');

			//pass squareId to Arena to change unit's coordinates
			this.props.moveToXY(squareId);

			//reduce number of actions when unit moves to EMPTY square past its original
			this.props.reduceAction(1,"current");

			//TO WORK: setState to remove the highlight of available squares
		}

		/*
		//This is interfering with unit selection
		else if (this.props.unitIsSelected) {
			this.props.resetSelection();
		}
		*/
	}

	componentDidUpdate(prevProps, prevState) {
		/*
		if (this.props.available(this.props).length === 0 && this.props.isOpen) {
			console.log("available");
			console.log(this.props.available(this.props));
			this.openSquare.open = true;
		}
		*/
		if (this.props.children[0].length === 12 && this.props.children[1].length === 12) {
			for (let i=0; i<12; i++) {
				if (this.props.children[0][i] !== null) {
					this.props.enemySpace(this.props, this.props.children[0][i].key);
				} else if (this.props.children[1][i] !== null) {
					this.props.enemySpace(this.props, this.props.children[1][i].key);
				}
			}
		}
	}

	render() {
		//The occupied squares are now set to false, they weren't before: this should prevent unit switching

		var openSquare;
		if (this.props.available(this.props).length === 0 && this.props.isOpen) {
			//console.log(this.props.xCoord, this.props.yCoord);
			openSquare = true;
		} else {
			openSquare = false;
		}

		//If props from emptySquare function in Arena are valid, highlight available squares with CSS class
		//onClick to move unit will operate only if square is within available proximity
		return (
			<div style={{
				width: '75px',
				height: '40px'
			}}
			id = {this.props.xCoord + ',' + this.props.yCoord}
			className={[this.props.boardSquare, openSquare ? 'availableSquare' : ''].join(' ')}
			data-empty = {this.state.empty}
			onClick = {this.handleClick}
			>
			{this.props.children}
			</div>
		)
	}
};

module.exports = Square;

/*
what wasn't working:
componentWillReceiveProps (without argument)
shouldComponentUpdate --> requires a Boolean return
componentDidUpdate --> creates a loop of the 14 units "Occupied"
componentWillUpdate --> creates a loop of the 14 units "Occupied"
forceUpdate
*/