const mongoose = require('mongoose');

const Teamname = new mongoose.Schema({
	name : String,
	leader : String
});

module.exports = mongoose.model('teamname', Teamname);
