const mongoose = require('mongoose');

const Randomteam = new mongoose.Schema({
	enemyteam : Array,
});

module.exports = mongoose.model('randomteam', Randomteam);
