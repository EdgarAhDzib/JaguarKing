const express = require('express')
const router = express.Router();

const Unit = require('../models/unit');
const Randomteam = require('../models/randomteam');

var randunits = [];
var fullteam = [];
var allTeams = [];

//GET will keep pushing on refresh, POST will collect once
router.get('/randunit', (req, res) => {

	//$or searches for units from All OR selected team
	Unit.find({ $or:[ {'team': "Common"}, {'team': "P'urhepecha"}] }, (err, results) => {
		for (let i=0; i<results.length; i++) {
			randunits.push(results[i]);
		}
	});

	Unit.find({'team': "P'urhepecha"}, (err, results) => {
		for (let i=0; i<results.length; i++) {
			randunits.push(results[i]);
		}

		var unitLen = randunits.length;
		//Randomly select 12 units from the team and push them into the fullteam array
		//that will be saved in randomteams Mongo collection
		for (let i=0; i<12; i++){
			var randNum = Math.floor((Math.random() * unitLen) );
			fullteam.push(randunits[randNum]);
		}

		//Save the randomly generated array into the randomteams collection
		var newTeam = new Randomteam({
			enemyteam: fullteam
		});

		newTeam.save(function(error, doc) {
			// Log any errors
			if (error) {
			console.log(error);
			}
		});

	}).then(

	//Redirect to the front page after adding team
	res.redirect('/')
	);
});

router.get("/enemies", function(req, res) {

	//Initialize a variable that will then receive the value of a team Id, for the next query to reference
	var randId;
	var resLen = 0;
	var teamLength = allTeams.length;

	Randomteam.find({}, (err, results)=>{
		resLen = results.length;

		//The teams array will continue to receive pushes on reload,
		//so pushing should occur only if the ids in the array are less than the available teams, to prevent overflow
		if (teamLength < resLen) {
			for (let i=0; i<resLen; i++) {
				allTeams.push(results[i]._id);
			}
		}

		randNum = Math.floor((Math.random() * resLen) );
		randId = allTeams[randNum];

		Randomteam.findOne({'_id':randId})
		.exec(function(err, doc) {
			if (err) {
				console.log(err);
			}
			else {
				res.json(doc);
			}
		});
	});
});

router.get("/allies", function(req, res) {

	//Initialize a variable that will then receive the value of a team Id, for the next query to reference
	var randId;
	var resLen = 0;
	var teamLength = allTeams.length;

	Randomteam.find({}, (err, results)=>{
		resLen = results.length;

		//The teams array will continue to receive pushes on reload,
		//so pushing should occur only if the ids in the array are less than the available teams, to prevent overflow
		if (teamLength < resLen) {
			for (let i=0; i<resLen; i++) {
				allTeams.push(results[i]._id);
			}
		}

		randNum = Math.floor((Math.random() * resLen) );
		randId = allTeams[randNum];

		Randomteam.findOne({'_id':randId})
		.exec(function(err, doc) {
			if (err) {
				console.log(err);
			}
			else {
				res.json(doc);
			}
		});
	});
});

module.exports = router;