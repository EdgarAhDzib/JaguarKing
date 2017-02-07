const express = require('express')
const router = express.Router();

const Spell = require('../models/spell');

router.get("/spells", function(req, res) {

	Spell.find({}, (err, results)=>{
	})
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		}
		else {
			res.json(doc);
		}
	});
});

module.exports = router;