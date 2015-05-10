Template.app.helpers({

});

Template.app.events({
	'click [data-action=create-game]': function(e) {

		if (!Meteor.userId()) {
			return Session.set('lightbox', 'login');
		}

		Meteor.call('game', function(error, id) {
            if (error) {
            	return alert(error);
            }

            Router.go('game', {_id: id});  
        });
	},

	'click [data-action]': function(e) {
		e.preventDefault();
	}
});