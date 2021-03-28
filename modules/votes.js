module.exports = async client => {

    const ms = require('parse-ms');
    const voteTimeout = 36000000;

    function check(guildID, userID) {

        const delay = client.votes_db.get(`${guildID}-${userID}`);

        if(delay !== null && voteTimeout - (Date.now() - delay) > 0) {
            return true;
        } else {
            return false;
        };

    };

    function remaming(guildID, userID) {
        const delay = client.votes_db.get(`${guildID}-${userID}`);

        if(delay !== null && voteTimeout - (Date.now() - delay) > 0) {

            let time = ms(voteTimeout - (Date.now() - delay));

            return time;

        } else {
            return false;
        };
    }

    function vote(guildID, userID) {

        if(!check(guildID, userID)) {
            client.settings.ensure(guildID, client.config.default.guild_settings);
            client.settings.inc(guildID, 'profile.upvotes');
            client.stats.inc(guildID, 'votes');
            client.votes_db.set(`${guildID}-${userID}`, Date.now());
            client.usersdata.ensure(userID, client.config.default.user_settings);
            client.usersdata.inc(userID, 'profile.gvotes')
            return true;
        } else {
            return false;
        }

    }

    client.votes = {
        check: check,
        vote: vote,
        remaming: remaming
    }

}