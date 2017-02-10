var React = require("react");
var axios = require("axios");
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {ListItem} from 'material-ui/List';

export default class Team extends React.Component{

	constructor() {
		super();
		this.chooseTeam = this.chooseTeam.bind(this);
	}

	chooseTeam() {
		axios.post('/team/' + this.props.id);
		this.props.handleClick(this.props.id);
	}

	render() {
		// Filter available spells
		// Companion icon, click for a modal with more details

		//onClick should access info and select the spell
		return (
			<a href={"#/battle/"}><ListItem key={this.props.id} id={this.props.id} onClick={this.chooseTeam} primaryText={this.props.teamAndLeader}
			 style={{color: "white", backgroundColor: this.props.color}} /></a>
		)
	}
};