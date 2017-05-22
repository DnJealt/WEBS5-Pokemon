
var io = null;

module.exports = function(connection){

    if(connection){

        io = require('socket.io').listen(connection);

    
        io.on('connection', function(socket){
            console.log('A user is connected');
            // io.emit('hoi', 'hoi');
            // socket.on('refresh all', function(status){
            // console.log('Zit in ik in refresh all?')
            // if(res){
            //     io.emit('refresh feed',status);
            // }
            // else{
            //     io.emit('error');
            // }
            // });
        });
    }

    
    return {  
        gameAdded: function(game){
            io.emit('game added', game);
        }
    };

}