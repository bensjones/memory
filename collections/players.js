Players = new Meteor.Collection('players');

Meteor.methods({
    player: function(gameId) {

        var user    = Meteor.user(),
            answers = [];

        if (!user) throw new Meteor.Error(401, "You need to login");

        for(var i = 0; i < 81; i++)
            answers[i] = 0;

        var player = {
            userId    : user._id,
            gameId    : gameId,
            answers   : answers,
            filled    : [],
            finished  : false,
            joinedAt  : new Date().getTime()
        };

        return Players.insert(player);
    }
});