var React = require("react");

import {ListItem} from 'material-ui/List';

export default class Spell extends React.Component{

	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		// this.props.getUnitInfo(this.props.unitProps);
		// this.props.resetSelection();
		this.props.selectedSpell(this.props);
	}

	render() {
		// Filter available spells
		// Companion icon, click for a modal with more details

		//onClick should access info and select the spell
		return (
			<ListItem key={this.props.id} id={this.props.id} onClick={this.handleClick} primaryText={this.props.id + " (" + this.props.cost + ")"} />
		)
	}
};