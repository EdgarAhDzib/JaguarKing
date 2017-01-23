const express = require('express')
const router = express.Router();

const Teamname = require('../models/teamname');

router.get('/selectteam', (req, res) => {
	Teamname.find({}, (err, results) => {
		var teams = [];
		for (let i=0; i<results.length; i++) {
			teams.push(results[i].name);
		}
		res.send(teams);
	});
});

module.exports = router;