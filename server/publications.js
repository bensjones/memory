Meteor.publish('me', function() {
    return Meteor.users.find({_id: this.userId});
});

Meteor.publish('game', function (id) {
    return [
        Games.find({_id: id}), 
        Players.find({ gameId: id })
    ];
});