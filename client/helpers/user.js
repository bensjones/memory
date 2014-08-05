UI.registerHelper('user', function(id){
   return Meteor.users.findOne({ _id : id });
});