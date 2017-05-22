// load the things we need
var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
     Name: {type: String, unique: true},
     _creator: { type: mongoose.Schema.Types.Mixed },
     creatorPokemon: { type: mongoose.Schema.Types.Mixed },
     _challenger: { type: mongoose.Schema.Types.Mixed },
     challengerPokemon: { type: mongoose.Schema.Types.Mixed },
     Created: Date,
     HasStarted: Boolean
});

module.exports = mongoose.model('Game', gameSchema);    