// load the things we need
var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
     Name: String,
     _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
     creatorPokemon: [String],
     _challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
     challengerPokemon: [String],
     Created: Date,
     HasStarted: Boolean
});

module.exports = mongoose.model('Game', gameSchema);    