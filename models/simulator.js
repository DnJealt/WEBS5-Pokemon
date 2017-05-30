var offendingMatchups = require('./offendingMatchups');
var defendingMatchups = require('./defendingMatchups');

var self = this;

var simulator = {
    simulate : function(pokemon1, pokemon2){
        var base = 1;
        
        if(pokemon1.type1){
            var defendingtype1 = defendingMatchups[pokemon2.type1];

            /* Check for undefined, because uneffective moves (e.g. electric > ground)
               return 0, which is interpreted as 'false' thanks to JavaScript. */
            if(defendingtype1[pokemon1.type1] != undefined){
                // We should get a number, so multiply the base with it
                base *= defendingtype1[pokemon1.type1]
            }           
            
            // Do the same thing again if the defending pokemon has two types
            if(pokemon2.type2){
                 var defendingtype2 = defendingMatchups[pokemon2.type2];

                 if(defendingtype2[pokemon1.type1] != undefined){
                    base *= defendingtype2[pokemon1.type1]
                }      
            }   
        }

        return base;         
    }
}

module.exports = simulator;