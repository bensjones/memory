Router.configure({
    layoutTemplate: 'app'
});

Router.map(function() {
    this.route('home', {
        path: '/',
    });

    this.route('game', {
        path: '/:_id',
        waitOn: function() { 
            return Meteor.subscribe('game', this.params._id) 
        },
        data: function() {
            return {
                game: Games.findOne(this.params._id),
                players: Players.find({gameId: this.params._id})
            };
        },
        onBeforeAction: function() {
            Session.set('game', this.params._id);
            this.next();
        }
    });
});