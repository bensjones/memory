Template.lightbox.helpers({
	visible: function() {
		return Session.get('lightbox');
	},
	template: function() {
		return Session.get('lightbox');
	}
});

Template.lightbox.events({
	'click [data-action="lightbox-close"]': function(e) {
		Session.set('lightbox', null);
	}
});