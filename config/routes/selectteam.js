const express = require('express')
const router = express.Router();

const Teamname = require('../models/teamname');
const Randomteam = require('../models/randomteam');

router.get('/selectteam', (req, res) => {
	Teamname.find({}, (err, results) => {
		var teams = [];
		for (let i=0; i<results.length; i++) {
			teams.push(results[i]);
		}
		res.send(teams);
	});
});

router.post('/team/:id', (req, res) => {
	//Select a random team based on the name passed through the POST parameter
	Randomteam.find({'team': req.params.id}, (err, results) => {

		var randNum = Math.floor((Math.random() * results.length) );
		randId = results[randNum];

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

router.post('/enemies/:id', (req, res) => {

	Teamname.find({}, (err, results) => {
		var allTeams = [];
		for (let i=0; i<results.length; i++) {
			allTeams.push(results[i]);
		}
		function currTeam(val) {
			return val !== req.params.id;
		}
		// var otherTeams = allTeams.filter((val) => val !== req.params.id);
		var otherTeams = allTeams.filter(currTeam);
		var randIndex = Math.floor((Math.random() * results.length) );
		var randTeamName = otherTeams[randIndex];

		//Select a random team excluding the name passed through the POST parameter
		Randomteam.find({'team': randTeamName.name}, (err, teamResults) => {

			var randNum = Math.floor((Math.random() * teamResults.length) );
			var randId = teamResults[randNum];

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
});

module.exports = router;