const mongoose = require('mongoose');

const Teamname = new mongoose.Schema({
	name : String
});

module.exports = mongoose.model('teamname', Teamname);
