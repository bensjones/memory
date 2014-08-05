Template.home.events({
    'click [data-action=create-game]': function(e){

        e.preventDefault();

        Meteor.call('game', function(error, id) {
            if (error)
                console.log(error);

            Router.go('game', {_id: id});
        });
    }
})