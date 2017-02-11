var React = require("react");
var axios = require("axios");

import Arena from "./Arena"
import UnitInfo from "./UnitInfo"
import Spell from "./Spell"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class PlayField extends React.Component{
	constructor() {
		super();
		this.state = {
			playerTurn: true,
			wait: false,
			resetSpeed: false,

			isShowingModal: false,
			secondModal: false,
			unitStats: "",
			unitHP: 0,
			//Is this one necessary?
			selectUnit: "",

			highlighted: false,
			enemyName: "",
			enemyLeader: "",
			allyName: "",
			allyLeader: "",
			enemyZaki: 0,
			allyZaki: 0,
			enemyAction: "",
			allyAction: "",
			spellField: "",
			spellList: [],
			selectedSpell: "",
			fieldDivClass: "",
			cursorIcon: "",
			//TO WORK: this may not be necessary
			spellsFromField: []
		};

		this.teams = {
			enemyLogo : "",
			enemyZaki : 0,
			enemyStats : {},
			allyLogo : "",
			allyZaki : 0,
			allyStats : {}
		};

		this.unitStats = {
			unit : {},
			unitHP : 0
		};

		this.combatSpell = {
			cursorIcon : "",
			selectedSpell : "",
			cost : 0,
			fieldDivClass : "",
			spellIsCast : false
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.chooseField = this.chooseField.bind(this);
		this.selectedSpell = this.selectedSpell.bind(this);
		this.displayEnemy = this.displayEnemy.bind(this);
		this.displayAlly = this.displayAlly.bind(this);
		this.spellIsCast = this.spellIsCast.bind(this);
		this.getUnitInfo = this.getUnitInfo.bind(this);
		this.enemyTurn = this.enemyTurn.bind(this);
		this.wait = this.wait.bind(this);

		this.enemySide = this.enemySide.bind(this);
		this.allySide = this.allySide.bind(this);
		
		// TO WORK: Does this belong here?
		//this.spellField = this.spellField.bind(this);
		
		this.resetAction = this.resetAction.bind(this);

	}

	getUnitInfo(unit) {
		this.setState({
			unitStats: unit,
			//unitHP: hp
		});
	}

	enemySide(team) {
		this.setState({
			enemyName:team
		});
	}

	allySide(team) {
		this.setState({
			allyName:team
		});

	}

	resetAction(spellCost) {
		this.combatSpell.cursorIcon = "";
		this.combatSpell.selectedSpell = "";
		this.combatSpell.cost = 0;
		var zakiToReduce = this.state.allyZaki;
		console.log(spellCost);
		this.setState({allyZaki: zakiToReduce - spellCost});
		/*
		this.setState({
			cursorIcon: "",
			selectedSpell: "",
		},
		function () {
    		console.log("Stuff should be updated now");
    	});
		*/
		console.log("resetAction function");
	}

	displayEnemy(actionText) {
		this.setState({enemyAction: actionText});
	}

	displayAlly(actionText) {
		this.setState({allyAction: actionText});
	}

	componentDidMount() {
		axios.get("/spells").then(function(response) {
			this.setState({spellList:response.data});
		}.bind(this) );

		var allyZakiPts = Math.floor((Math.random() * 40) + 120);
		var enemyZakiPts = Math.floor((Math.random() * 40) + 120);
		this.setState({
			allyZaki: allyZakiPts,
			enemyZaki: enemyZakiPts
		});
	}

	componentDidUpdate(prevProps, prevState) {
	}

	handleClick() {
		//Run this only if spell hasn't been cast yet
		if (this.combatSpell.spellIsCast === false) {
			//Switch to open modal
			this.setState({isShowingModal: true});
		} else {
			console.log("Spell already cast for this turn!")
		}

	}
	
	handleClose() {
		this.setState({
			isShowingModal: false,
			secondModal: false
		});
	}

	enemyTurn() {
		this.setState({
			playerTurn: !this.state.playerTurn,
			resetSpeed: true
		});
	// TO WORK: the DONE button should reset the units' movements, also changing the state for allyMoves
	// or enemyMoves arrays; Also cannot choose spell during enemy's turn
	}

	wait() {
		if (this.state.playerTurn) {
			this.setState({wait: !this.state.wait});
		}
	}

	chooseField(event) {
		//Gets the id for the image maps' selected quad
		var quad = event.target.getAttribute('id');
		switch (quad) {
			case "Blood" :
				this.combatSpell.fieldDivClass = 'blood_panel';
				this.combatSpell.cursorIcon = 'blood_magic';
				/*
				this.setState({
					fieldDivClass:'blood_panel',
					cursorIcon: 'blood_magic'
				});
				*/
				break;
			case "Death" :
				this.combatSpell.fieldDivClass = 'death_panel';
				this.combatSpell.cursorIcon = 'death_magic';
				/*
				this.setState({
					fieldDivClass:'death_panel',
					cursorIcon: 'death_magic'
				});
				*/
				break;
			case "Life" :
				this.combatSpell.fieldDivClass = 'life_panel';
				this.combatSpell.cursorIcon = 'life_magic';
				/*
				this.setState({
					fieldDivClass:'life_panel',
					cursorIcon: 'life_magic'
				});
				*/
				break;
			case "Elemental" :
				this.combatSpell.fieldDivClass = 'elemental_panel';
				this.combatSpell.cursorIcon = 'nature_magic';
				/*
				this.setState({
					fieldDivClass:'elemental_panel',
					cursorIcon: 'nature_magic'
				});
				*/
				break;
			default :
				break;
		}
		this.setState({
			spellField: quad,
			secondModal: true
		});
	}

	selectedSpell(props) {
		//TO WORK: Set up conditions to limit spells to once per turn and only if Zaki suffice
		this.combatSpell.selectedSpell = props.id;
		this.combatSpell.cost = props.cost;
		this.setState({
			isShowingModal: false,
			secondModal: false
		});
	}

	spellIsCast() {
		this.combatSpell.spellIsCast = true;
	}

	render() {
		//TO WORK: These should be opened in the submenu, not in the thumbnails per se
		//Add onClick to each option to activate the spell
		var selectedField = this.state.spellField;
		var selectedSpell = this.selectedSpell;
		var spellIsCast = this.spellIsCast;
		var spellsFromField;
		var cursorIcon = this.combatSpell.cursorIcon;
		var combatSpell = this.combatSpell.selectedSpell;
		var spellCost = this.combatSpell.cost;
		var wait = this.wait;
		var waitClicked = this.state.wait;
		var resetSpeed = this.state.resetSpeed;

		// console.log(this.combatSpell);
		// console.log(this.state.playerTurn);
		
		// console.log(this.state.selectedSpell, "from PlayField");
		// console.log(this.state.cursorIcon, "from PlayField");

		if (this.state.spellField !== "") {
			spellsFromField = this.state.spellList.map(function(spell){
				if (spell.Field === selectedField) {
					return <Spell key={spell.Battle} id={spell.Battle} cost={spell.Cost} selectedSpell={selectedSpell} />
				}
			})
		}

		//console.log(this.state.unitStats.id, "from PlayField")

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
					<div className="battleField" style={{
					width: '80%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<div className="unitGrid" >
							<Arena getUnitInfo={this.getUnitInfo} allySide={this.allySide} enemySide={this.enemySide}
							selectedSpell={combatSpell} cursorIcon={cursorIcon} selectedUnitId={this.unitStats.unit.id}
							resetAction={this.resetAction} spellCost={spellCost} spellIsCast={spellIsCast}
							playerTurn={this.state.playerTurn} enemyTurn={this.enemyTurn} waitClicked={waitClicked}
							resetSpeed={resetSpeed} displayEnemy={this.displayEnemy} displayAlly={this.displayAlly} />
						</div>
					</div>
					<div className="infoPanel" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}>
						<UnitInfo getUnitInfo={this.state.unitStats} />
					</div>
				</div>
				<div style={{
				width:'100%',
				clear: 'both',
				float: 'left',
				display: 'block',
				position: 'relative'
				}}
				>
					<div className="enemyLogo" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<MuiThemeProvider>
							<List>
								<ListItem primaryText={this.state.enemyName} />
								<ListItem primaryText={this.state.enemyAction} />
							</List>
						</MuiThemeProvider>
					</div>
					<div className="enemyStats" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<MuiThemeProvider>
							<List>
								<ListItem primaryText={this.state.enemyLeader} />
								<ListItem primaryText={"Zakí " + this.state.enemyZaki} />
							</List>
						</MuiThemeProvider>
					</div>
					<MuiThemeProvider>
						<div className="options" style={{
						width: '20%',
						height: '100%',
						display: 'flex',
						float:'left',
						flexWrap: 'wrap'
						}}
						>
							<h3>Options<br/></h3>
							<div style={{width:'100%',
								height: '100%',
								display: 'flex',
								flexWrap: 'wrap'
								}} >
								<div style={{width:'50%'}} >
									<RaisedButton label="SHOOT" primary={this.state.playerTurn ? true : false} secondary={this.state.playerTurn ? false : true} />
								</div>
								<div style={{width:'50%'}} >
									<RaisedButton label="SPELL" primary={this.state.playerTurn ? true : false} secondary={this.state.playerTurn ? false : true} onClick={this.handleClick}>
										{
										this.state.isShowingModal && this.state.playerTurn &&
										<ModalContainer onClose={this.handleClose}>
											<ModalDialog onClose={this.handleClose}>
												<div className="modal" style={{
													width:'100%',
													height: '100%',
													display: 'flex',
													flexWrap: 'wrap'}}>
													<div className="bloodQuad img-responsive" style={{width:'50%', height: '50%'}}>
														<img src={"./assets/images/backgrounds/blank.jpg"} id={"Blood"} alt="bloodSpells" onClick={this.chooseField}/>
													</div>
													<div className="deathQuad img-responsive" style={{width:'50%', height: '50%'}}>
														<img src={"./assets/images/backgrounds/blank.jpg"} id={"Death"} alt="deathSpells" onClick={this.chooseField}/>
													</div>
													<div className="lifeQuad img-responsive" style={{width:'50%', height: '50%'}}>
														<img src={"./assets/images/backgrounds/blank.jpg"} id={"Life"} alt="lifeSpells" onClick={this.chooseField}/>

													</div>
													<div className="elementalQuad img-responsive" style={{width:'50%', height: '50%'}}>
														<img src={"./assets/images/backgrounds/blank.jpg"} id={"Elemental"} alt="elementalSpells" onClick={this.chooseField}/>
													</div>
													{
													this.state.secondModal &&
													<ModalContainer onClose={this.handleClose}>
														<ModalDialog onClose={this.handleClose}>
															<div className={this.combatSpell.fieldDivClass} style={{
																width:'100%',
																height: '100%',
																display: 'flex',
																flexWrap: 'wrap'}}>
																<div style={{width:'100%'}}><h2>{selectedField} Spells</h2></div>
																<h4><List>{spellsFromField}</List></h4>
															</div>
														</ModalDialog>
													</ModalContainer>
													}

												</div>
											</ModalDialog>
										</ModalContainer>
										}
									</RaisedButton>
								</div>
								<div style={{width:'50%'}} >
									<RaisedButton label="WAIT" primary={this.state.playerTurn ? true : false} secondary={this.state.playerTurn ? false : true} onClick={wait} />
								</div>
								<div style={{width:'50%'}} >
									<RaisedButton label="DONE" primary={this.state.playerTurn ? true : false} secondary={this.state.playerTurn ? false : true} onClick={this.enemyTurn} />
								</div>
							</div>
						</div>
					</MuiThemeProvider>
					<div className="playerStats" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<MuiThemeProvider>
							<List>
								<ListItem primaryText={this.state.allyLeader} />
								<ListItem primaryText={"Zakí " + this.state.allyZaki} />
								<ListItem primaryText={"Spell " + this.combatSpell.selectedSpell} />
							</List>
						</MuiThemeProvider>
					</div>
					<div className="playerLogo" style={{
					width: '20%',
					height: '100%',
					display: 'flex',
					float:'left',
					flexWrap: 'wrap'
					}}
					>
						<MuiThemeProvider>
							<List>
								<ListItem primaryText={this.state.allyName} />
								<ListItem primaryText={this.state.allyAction} />
							</List>
						</MuiThemeProvider>
					</div>
				</div>
			</div>
		)
	}
};

/*
<div style={{width:'50%'}} >
	<RaisedButton label="MOVE" primary={true} />
</div>
<div style={{width:'50%'}} >
	<RaisedButton label="ATTACK" primary={true} />
</div>
*/