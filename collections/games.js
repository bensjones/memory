Games = new Meteor.Collection('games');

Meteor.methods({
    game: function() {
        var user = Meteor.user();

        if (!user) throw new Meteor.Error(401, "You need to login to create a game");

        var game = {
            _id         : Random.id(4),
            status      : 'registration',
            createdAt   : new Date().getTime(),
            createdBy   : user._id
        };

        var id = Games.insert(game);

        Meteor.call('join', id);

        return id;
    },
    join: function(gameId){

        var user = Meteor.user(),
            game = Games.findOne(gameId);

        if (!user) throw new Meteor.Error(401, "You need to login to join a game");
        if (!game) throw new Meteor.Error(404, "Game not found");

        var playerId = Meteor.call('player', gameId);

        return playerId;
    },
    ready: function(gameId) {

        var user = Meteor.user();

        if (!user) throw new Meteor.Error(401, "You need to login");

        Players.update({gameId: gameId, userId: user._id}, { $set : { ready : true } });

        // Start the game if everyone is ready
        if(Players.find({gameId: gameId, ready : { $ne : true }}).count() < 1) {

            var matrix = []

            if (Meteor.isServer) {

                var sudoku = new Sudoku();

                sudoku.newGame();

                matrix = sudoku.matrix;
            }

            Games.update({ _id: gameId }, { $set : { status : 'playing', startedAt: new Date().getTime(), matrix : matrix }});
        }
    },
    play: function(gameId, cell, value) {

        cell  = parseInt(cell);
        value = parseInt(value);

        if (value > 9 || value < 0) throw new Meteor.Error(400, "Invalid");

        var user  = Meteor.user();

        if (!user) throw new Meteor.Error(401, "You need to login");

        var player = Players.findOne({ gameId: gameId, userId: user._id }),
            game   = Games.findOne(gameId),
            query  = { };

        player.answers[cell] = value;

        var progress = Math.round( (_.without(player.answers, 0).length * 100) / (81 - _.without(game.matrix, 0).length) );

        query.$set = { answers : player.answers, progress : progress };

        if(value) {
            query.$addToSet = { filled : cell };
        } else {
            query.$pull = { filled : cell };
        }

        Players.update({_id: player._id}, query);

        if(Meteor.isServer) {

            sudoku = new Sudoku();

            for(var i = 0; i < 81; i++) {
                sudoku.matrix[i] = game.matrix[i] ? game.matrix[i] : player.answers[i];
            }

            if(sudoku.gameFinished()) {
                Players.update({_id: player._id}, { $set : { finished : new Date().getTime() } });
            }
        }
    },
    reset: function(gameId) {

        var user = Meteor.user();

        if (!user) throw new Meteor.Error(401, "You need to login");

        var player = Players.findOne({ gameId: gameId, userId: user._id });

        if(!player.answers)
            player.answers = []

        for(var i = 0; i < 82; i++) {
            player.answers[i] = 0;
        }

        Players.update({_id: player._id}, { $set : { answers : player.answers, filled : [], progress : 0 } });
    }
});