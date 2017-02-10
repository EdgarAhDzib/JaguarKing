var React = require("react");
var axios = require("axios");
import Team from './Team';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {List, ListItem} from 'material-ui/List';

//TO WORK: remove here if it works in Team component
import { connect } from "react-redux"
import { selectTeam } from '../../actions/teamsActions'

@connect((store) => {
	//console.log(store);
	return {
		//Properties from reducer
		playerTeam: store.teams.team
	};
})

export default class TeamMenu extends React.Component{
	constructor() {
		super();
		this.state = {
			chooseTeam: []
		}
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(item) {
		console.log(item);
		this.props.dispatch(selectTeam(item));
	}

	componentDidMount() {
		axios.get("/selectteam").then(function(response) {
			this.setState({chooseTeam: response.data});
		}.bind(this) );
	}

	render() {
		var handleClick = this.handleClick;
		
		var backgroundColors = [
			'#2196F3',
			'#9C27B0',
			'#E91E63',
			'#2E7D32',
			'#FF5722',
			'#009688',
			'#424242',
			'#795548',
			'#B71C1C'
		];

		var teamOptions = this.state.chooseTeam.map(function(team, inc){
			return <Team key={team.name} id={team.name} handleClick={handleClick} color={backgroundColors[inc]} teamAndLeader={team.name + ", " + team.leader} />
		})
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
					<div style={{
					width: '60%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<MuiThemeProvider>
							<div style={{margin:'auto'}}>
							<img src={'assets/images/logo1.png'} height={'150'} />
								<h1>
									<List>{teamOptions}</List>
								</h1>
							</div>
						</MuiThemeProvider>
					</div>
					<div style={{
					width: '40%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<img src={"assets/images/eight_deer.png"} height={"600"} className={"img-responsive"} />
					</div>
				</div>
			</div>
			)
	}

};