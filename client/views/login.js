Template.login.events({
    'submit form[name=login]' : function(e){

        e.preventDefault();

        console.log('login');

        var name = $(e.target).find('[name=name]').val();

        Accounts.createUser({password: Meteor.uuid(), username: Meteor.uuid(), profile: { name: name }});
    }
})