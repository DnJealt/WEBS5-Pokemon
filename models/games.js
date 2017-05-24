// load the things we need
var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
     Name: {type: String, unique: true, required: true},
     _creator: { type: mongoose.Schema.Types.Mixed, required: true },
     creatorPokemon: { type: mongoose.Schema.Types.Mixed },
     _challenger: { type: mongoose.Schema.Types.Mixed },
     challengerPokemon: { type: mongoose.Schema.Types.Mixed },
     Created: {type: Date,
          validate: notInFuture,
          required: true},
     HasStarted: {type:Boolean, required: true}
});



function notInFuture (date){
   return date <= new Date;
}

module.exports = mongoose.model('Game', gameSchema);    