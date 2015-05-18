Template.board.helpers({
	class: function() {
		var className = '';

		if (this.finished) {
			className += 'board--finished ';
		}
		
		return className;
	},
	isOwner: function() {
		return this.userId === Meteor.userId();
	},
	canClear: function() {
		return this.userId === Meteor.userId() && !this.finished && _.compact(this.answers).length;
	},
	showName: function() {
		return this.userId !== Meteor.userId();
	},
	duration: function() {
		var game = Games.findOne(this.gameId);

		if (game && this.finished) {
			return this.duration - game.startedAt;
		}
	}
});

Template.board.events({
	'click [data-action="reset"]': function(e) {
        Meteor.call('reset', this.gameId);
    }
})