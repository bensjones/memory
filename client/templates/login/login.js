Template.login.events({
    'submit form[name=login]' : function(e) {
    	e.preventDefault();
    	
        var name = $(e.target).find('[name=name]').val();

        Accounts.createUser({password: Meteor.uuid(), username: Meteor.uuid(), profile: { name: name }});

        Session.set('lightbox', null);
    }
});

Template.login.rendered = function() {
	this.find('[name=name]').focus();
}