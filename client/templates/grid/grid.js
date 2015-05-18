Template.grid.helpers({
	class: function() {
		var className = '';
		var game = Games.findOne(this.gameId);
		var merged = _.map(this.answers, function(num, key){ return game.cells[key] ? game.cells[key] : num; });

		if (this.userId != Meteor.userId()) {
			className += 'grid--small grid--disabled ';
		}
		
		if(!_.filter(merged, function(num){ return num == 0; }).length && !this.finished && this.userId == Meteor.userId()) {
            className += 'animation animation--shake ';
        }
		
		return className;
	},

	cells: function() {
		var self = this;
		var cells = [];
		var game = Games.findOne(this.gameId);
		var isPlayer = this.userId === Meteor.userId();
		var answers = this.answers || [];

		// todo clean this
		if (game.cells) {
			game.cells.forEach(function(value, index) {

				var cell = {
					index: index,
					selected: false,
					disabled: false,
					value: null
				};

				if (!value) {
					if (answers[index]) {
						if (isPlayer) {
							value = answers[index];
						} else {
							cell.disabled = true;
						}
					}
				} else {
					cell.disabled = true;
					
					if (!isPlayer) {
						value = null;
					}
				}

				if (value) {
					cell.value = value;
				}

				if (isPlayer && Session.get('selected') === index) {
					cell.selected = true;
				}

				if (self.finished) {
					cell.disabled = true;
					cell.selected = false;
				}

				cells.push(cell);
			});
		}

		return cells;
	}
});

Template.grid.events({
	'click :not(.grid--disabled) .grid-cell': function(e) {
		var game = Router.current().data().game;
		var index = $(e.target).index();
		
		Session.set('selected', index);
	}
});