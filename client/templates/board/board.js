Template.board.helpers({
    attributes: function(){
        var player = Players.findOne({_id: this._id});

        var attributes = {
            class: 'board',
            id: "user-board"
        }

        // Full grid & invalid
        if(player.progress == 100 && !player.finished && player.userId == Meteor.userId()) {
            attributes.class += ' animation-shake'
        }

        if(player.userId != Meteor.userId()) {
            attributes.class += ' board--disabled';
        }

        return attributes;
    },
    duration: function(){
        var game     = Games.findOne({_id : this.gameId }),
            start    = moment(game.startedAt),
            end      = moment(this.finished),
            duration = moment.duration(end - start, "milliseconds"),
            result   = '';

        if(duration.asHours() >= 1)
            result += ((duration.hours() < 10) ? '0' + duration.hours() : duration.hours()) + ':'

        if(duration.asMinutes() >= 1)
            result += ((duration.minutes() < 10) ? '0' + duration.minutes() : duration.minutes()) + ':'

        result += duration.seconds()

        return result;
    },
    user: function(){
        var player = Players.findOne({_id: this._id});

        return Meteor.users.findOne({_id: player.userId});
    },
    progression: function(){
        var player = Players.findOne({_id: this._id});

        if(!player.progress)
            player.progress = 0;

        return parseInt(player.progress);
    },
    cells: function() {
        var player = Players.findOne({_id: this._id}),
            game   = Games.findOne({_id : player.gameId }),
            isOpponent = player.userId != Meteor.userId();

        var cells = _.map(game.matrix, function(value, key) {

            var active    = false,
                cellValue = null,
                row       = Math.floor( ((key / 9) % 9) + 1),
                column    = (key - 9 * (row - 1)) + 1,
                disabled  = false;

            if(!isOpponent && player.answers[key] !== 0)
                cellValue = player.answers[key];

            if(value)
                cellValue = value;

            if(Session.get('active-cell') == key && player.userId == Meteor.userId() && value == 0) {
                active = true;
            }

            disabled = value ? true : false;

            if(isOpponent && _.contains(player.filled, key)) {
                disabled = true;
            }

            return {
                id       : key,
                value    : cellValue,
                disabled : disabled,
                row      : row,
                column   : column,
                active   : active
            }
        });

        return cells;
    }
});

Template.boardCell.helpers({
    class: function() {
        var result =  '';

        if(this.disabled) result += ' board-cell--disabled';
        if(this.active)   result += ' board-cell--active';

        return result;
    }
});

Template.userBoard.events({
    'click .board-cell': function(e){
        Session.set('active-cell', $(e.target).attr('data-id'));
    }
});


Template.userBoard.rendered = function(){
    $(window).on('keydown', function(e){

        var activeCell = Session.get('active-cell');

        var keys = { 8 : 0, 48 : 0, 27 : 0 , 49 : 1, 50 : 2, 51 : 3, 52 : 4, 53 : 5, 54 : 6, 55 : 7, 56 : 8, 57 : 9 };

        if(keys[e.which] >= 0 && activeCell) {

            e.preventDefault();

            Meteor.call('play', Session.get('game'), activeCell, keys[e.which] )
        }
    });
};