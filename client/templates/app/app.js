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

	'click [data-action=edit-name]': function(e) {
		Session.set('lightbox', 'login');
	},

	'click [data-action]': function(e) {
		e.preventDefault();
	},

	'click [readonly]': function(e) {
        $(e.target).select();
    }
});

$(window).on('keydown', function(e) {
    var code = e.which;
    var game = Games.findOne(Session.get('game'));
    var selected = Session.get('selected');
    var value = parseInt(String.fromCharCode(e.which));

    if (code === 27) {
        Session.set('lightbox', null);
    }

    if (!game || game.status !== 'playing' || Session.get('lightbox')) {
        return;
    }

    switch(code) {
        // backspace
        case 46:
        case 8: {
            e.preventDefault();
            Meteor.call('erase', game._id, selected);
            break;
        }
        // left
        case 37: {
            Session.set('selected', selected % 9 ? selected - 1 : selected + 8);
            break;
        }
        // up
        case 38: {
            Session.set('selected', selected - 9 < 0 ? selected + 72 : selected - 9);
            break;
        }
        // down
        case 39: {
            Session.set('selected', (selected + 1) % 9 ? selected + 1 : selected - 8);
            break;
        }
        // right
        case 40: {
            Session.set('selected', selected + 9 > 82 ? selected - 72 : selected + 9);
            break;
        }
    }

    if(selected > -1 && value) {
        Meteor.call('play', game._id, selected, value);
    }
});