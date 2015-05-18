Template.login.helpers({
	title: function() {
		return Meteor.userId() ? 'Edit your name' : "What's your name";
	},

	value: function() {
		var user = Meteor.user();

		return user ? user.profile.name : null;
	}
});

Template.login.events({
    'submit form[name=login]' : function(e) {
    	e.preventDefault();
    	
        var name = $(e.target).find('[name=name]').val();
        var user = Meteor.user();

        if (name) {
        	if (user) {
        	    Meteor.users.update({ _id: user._id }, { $set : { 'profile.name': name }});
        	} else {
        	    Accounts.createUser({password: Meteor.uuid(), username: Meteor.uuid(), profile: { name: name }});
        	}

        	Session.set('lightbox', null);
        }
    }
});

Template.login.rendered = function() {
	this.find('[name=name]').focus();
}