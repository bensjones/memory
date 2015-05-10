Template.game.helpers({
    isAdmin: function(){
        return Meteor.userId() === this.createdBy;
    },
    allowedToJoin: function(){
        if(this.status != 'registration')
            return false;

        if(Players.find({ gameId : this._id, userId : Meteor.userId() }).count() > 0)
            return false;

        return true;
    },
    players: function(){
        return Players.find({ gameId : this._id }, { sort: { joinedAt: 1 } });
    },
    hasJoined: function() {
        return Players.findOne({ gameId : this.game._id, userId : Meteor.userId() }).count();
    },
    showLink: function(){

        return true;
    }
});

Template.game.events({
    'click [data-action]': function(e){

        e.preventDefault();

        var action = $(e.target).attr('data-action');

        Meteor.call(action, Session.get('game'), function(error) {
            if (error)
                console.log(error);
        });
    },
    'click [name=url]': function(e) {
        $(e.target).select();
    }
});
