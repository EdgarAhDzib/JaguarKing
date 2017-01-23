const express = require('express')
const router = express.Router();

const Unit = require('../models/unit');

router.get('/units', (req, res) => {
	Unit.find({}, (err, results) => {
		res.json(results);
	});
});

module.exports = router;