Meteor.publish('game', function(id) {
    Meteor.publishWithRelations({
        handle: this,
        collection: Games,
        filter: id,
        mappings: [{
            reverse: true,
            key: 'gameId',
            collection: Players,
            filter: { userId : this.userId },
            options: {
                fields: {
                    filled: false
                }
            }
        }]
    });

    Meteor.publishWithRelations({
        handle: this,
        collection: Games,
        filter: id,
        mappings: [{
            reverse: true,
            key: 'gameId',
            collection: Players,
            options: {
                fields: {
                    answers: false
                }
            },
            mappings: [{
                key: 'userId',
                collection: Meteor.users
            }]
        }]
    });
});