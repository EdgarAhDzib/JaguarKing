var React = require("react");

class Square extends React.Component{
	
	constructor() {
		super();
		this.state = {
			empty: true,
			isSelected: false
		};
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		for (var i=0; i<7; i++) {
			if (this.props.children[0][i] != null || this.props.children[1][i] != null) {
				//Only the last unit was getting the changed state until the else condition was removed
				this.setState({empty:false});
				//This is logging with componentWillMount() and componentDidMount, but only the former is setting to false
			}
		}
	}

	handleClick(event) {
		if (event.target.getAttribute('class') === "boardSquare availableSquare") {
			var squareId = event.target.getAttribute('id');

			//pass squareId to Arena to change unit's coordinates
			this.props.moveToX(squareId);
			this.props.moveToY(squareId);

			//reduce number of actions / moves
			this.props.reduceAction();

			//TO WORK: setState to remove the highlight of available squares

		}
	}

	render() {
		this.props.available(this.props);

		var openSquare;
		if (this.props.available(this.props).length === 0 && this.props.isOpen) {
			//console.log(this.props.xCoord, this.props.yCoord);
			openSquare = true;
		} else {
			openSquare = false;
		}

		//If props from emptySquare function in Arena are valid, highlight available squares with CSS class
		//onClick to move unit will operate only if square is within available proximity
		//, this.props.cursorImage
		return (
			<div style={{
				width: '75px',
				height: '31px'
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
componentWillReceiveProps
shouldComponentUpdate --> requires a Boolean return
componentDidUpdate --> creates a loop of the 14 units "Occupied"
componentWillUpdate --> creates a loop of the 14 units "Occupied"
forceUpdate
*/