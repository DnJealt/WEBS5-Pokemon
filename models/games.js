// load the things we need
var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
     Name: {type: String, unique: true},
     _creator: { type: mongoose.Schema.Types.Mixed },
     creatorPokemon: [String],
     _challenger: { type: mongoose.Schema.Types.Mixed },
     challengerPokemon: [String],
     Created: Date,
     HasStarted: Boolean
});

module.exports = mongoose.model('Game', gameSchema);    