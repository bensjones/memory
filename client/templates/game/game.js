var duration = new ReactiveVar(0);

Template.game.helpers({
    duration: function() {
        if (this.game && this.game.status === 'playing') {
            return duration.get();
        }

        return null;
    }
});

Template.game.helpers({
    isHost: function() {
        return this.game.createdBy === Meteor.userId();
    },

    isPlaying: function() {
        return this.game.status === 'playing';
    },

    loggedPlayer: function() {
        return Players.findOne({ gameId: Session.get('game'), userId: Meteor.userId() });
    },

    opponents: function() {
        return Players.find({ gameId: Session.get('game'), userId: { $ne: Meteor.userId() } });
    },
    
    canLeave: function() {
        var player = Players.findOne({ gameId: Session.get('game'), userId: Meteor.userId() });

        if (player && this.game.createdBy !== player.userId) {
            return true;
        }

        return false;
    },

    canJoin: function() {
        var player = Players.findOne({ gameId: Session.get('game'), userId: Meteor.userId() });
        var players = Players.find({ gameId: Session.get('game') });

        if (!player && players.count() < Config.maxPlayers) {
            return true;
        }

        return false;
    }
});

Template.game.events({
    'click [data-action="start"]': function(e) {
        Meteor.call('start', this.game._id);
    },

    'click [data-action="join"]': function(e) {
        if (!Meteor.userId()) {
            return Session.set('lightbox', 'login');
        }
        
        Meteor.call('join', this.game._id, function(error) {
            if (error) {
                alert(error)
            }
        });
    },

    'click [data-action="leave"]': function(e) {
        Meteor.call('leave', this.game._id);
    }
});

Template.game.created = function() {
    var self = this;

    Deps.autorun(function() {
        var game = Games.findOne(Session.get('game'), { startedAt: { $exists: true }});

        if (game) {
            Meteor.setInterval(function() {
                duration.set( Date.now() - game.startedAt );
            }, 1);
        } else {
            duration.set(0);
        }
    });
};