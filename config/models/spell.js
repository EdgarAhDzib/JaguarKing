const mongoose = require('mongoose');

const Spell = new mongoose.Schema({
	Battle : String,
	Alt_name : String,
	Description : String,
	Prereq : String,
	Field : String,
	Scope : String,
	Cost : Number,
	Target : String
});

module.exports = mongoose.model('spell', Spell);
