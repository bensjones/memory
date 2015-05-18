Meteor.methods({
    game: function() {
        var user = Meteor.user();

        if (!user) {
            throw new Meteor.Error(401, 'You need to login to create a game');
        }

        var game = {
            _id         : Random.id(4),
            status      : 'registration',
            createdAt   : Date.now(),
            createdBy   : user._id
        };

        var id = Games.insert(game);

        Meteor.call('join', id);

        return id;
    },

    join: function(gameId) {
        check(this.userId, String);

        var user = Meteor.user();
        var game = Games.findOne(gameId);
        var player = Players.findOne({ gameId: gameId, userId: user._id });

        if (!game) {
            throw new Meteor.Error(404, 'Game not found');
        }

        if (player) {
            throw new Meteor.Error('not-allowed', 'Already joined');
        }

        var playerId = Meteor.call('player', gameId);

        return playerId;
    },

    leave: function(gameId) {
        check(this.userId, String);

        var user = Meteor.user();
        var game = Games.findOne(gameId);
        var player = Players.findOne({ gameId: gameId, userId: user._id });

        if (!game) {
            throw new Meteor.Error(404, 'Game not found');
        }

        if (game.status !== 'registration') {
            throw new Meteor.Error('not-allowed', 'Game already started');
        }

        Players.remove(player._id);
    },

    start: function(gameId) {
        var game = Games.findOne(gameId);

        if (!game) {
            throw new Meteor.Error(404, "Game not found"); 
        }

        var data = {
            status: 'playing',
            startedAt : Date.now(),
        };

        if(Meteor.isServer) {
            var sudoku = new Sudoku();

            sudoku.newGame();

            data.cells = sudoku.matrix;
        }

        Games.update({ _id: game._id }, { $set: data });
    },

    play: function(gameId, cell, value) {
        value = parseInt(value);
        cell = parseInt(cell);

        var user   = Meteor.user();
        var player = Players.findOne({ gameId: gameId, userId: user._id });
        var game   = Games.findOne(gameId);

        if (value && !player.finished && !game.cells[cell]) {
            var query  = { };

            player.answers[cell] = value;

            query.$set = { answers : player.answers };

            Players.update({ _id: player._id }, query);

            if (Meteor.isServer) {
                sudoku = new Sudoku();

                sudoku.matrix = _.map(player.answers, function(num, key){ return game.cells[key] ? game.cells[key] : num; });

                if (sudoku.gameFinished()) {
                    Players.update({ _id: player._id }, { $set : { finished: true, duration: Date.now() }});

                    var playersLeft = Players.find({ gameId: game._id, finished: { $ne: true } }).count();

                    if (playersLeft < 1) {
                        Games.update({ _id: game._id }, { $set: { status: 'finished' } });
                    }
                }
            }
        }
    },

    reset: function(gameId) {
        var user = Meteor.user();
        var emptyGrid = _.map(_.range(81), function(val, key) { return 0; });
        var player = Players.findOne({ gameId: gameId, userId: user._id });
        
        Players.update({ _id: player._id }, { $set: { answers : emptyGrid }});
    },

    erase: function(gameId, cell) {

        var user  = Meteor.user();

        if (!user) {
            throw new Meteor.Error(401, "You need to login");
        }

        var player = Players.findOne({ gameId: gameId, userId: user._id });
        var game   = Games.findOne(gameId);
        var query  = { };

        player.answers[parseInt(cell)] = 0;

        query.$set = { answers : player.answers };

        Players.update({ _id: player._id }, query);
    },

    player: function(gameId) {
        var user = Meteor.user();
        var game = Games.findOne(gameId);
        var answers = _.map(_.range(81), function(val, key) { return 0; });

        if (!user) {
            throw new Meteor.Error(401, "You need to login to join a game");
        }

        if (!game) {
            throw new Meteor.Error(404, "Game not found");
        }

        var player = {
            userId    : user._id,
            name      : user.profile.name,
            gameId    : gameId,
            answers   : answers,
            joinedAt  : new Date().getTime()
        };

        var playerId = Players.insert(player);

        return {
            _id: playerId
        }
    }
});