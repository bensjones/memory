Players = new Meteor.Collection('players', {
    transform: function (doc) {
        if (Meteor.userId() != doc.userId) {
            doc.answers = _.map(doc.answers, function(answer) { return answer === 0 ? 0 : 1; });
        }

        return doc;
    }
});