const mongoose = require('mongoose');

const Unit = new mongoose.Schema({
	name : String,
	no : Number,
	type : String,
	level : Number,
	xp : Number,
	hp : Number,
	melee : Number,
	ranged : Number,
	defense : Number,
	magic : Number,
	poison : Number,
	spells : Number,
	resist : Number,
	speed : Number,
	ammo : Number,
	percept : Number,
	air : Number,
	day : Number,
	team : String,
	image : String
});

module.exports = mongoose.model('unit', Unit);
