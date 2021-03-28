module.exports = async client => {

    const moment = require('moment');

    let default_stats = {
        guildBanAdd: 0,
        guildBanRemove: 0,
        guildMemberAdd: 0,
        guildMemberRemove: 0,
        messages: 0,
        commands: 0,
        page_visits: 0,
        bot_website_refers: 0,
        store_visits: 0,
        sales_number: 0,
        minutes_spoke: 0,
        votes: 0,
    };

    function save(guildID, key, value) {

        if(!client.guilds.cache.get(guildID)) return;

        let date = moment().format('DD/MM/YYYY');

        client.stats_db.ensure(`${guildID}-${date}`, default_stats);
        client.stats_array.ensure(guildID, []);

        let stats_array = client.stats_array.get(guildID);
        let confirmation = [];

        stats_array.map(obj => {
            if(obj === date) {
                confirmation.push(true);
            };
        });

        if(confirmation.length === 0) {
            client.stats_array.push(guildID, date);
        }

        client.stats_db.set(`${guildID}-${date}`, value, key);

        return client.stats_db.get(`${guildID}-${date}`);

    };

    function get(guildID, date) {

        if(!client.guilds.cache.get(guildID)) return;
        
        if(!date) date = moment().format('DD/MM/YYYY');

        let stats = client.stats_db.get(`${guildID}-${date}`);

        return stats;
    };

    function inc(guildID, key) {

        if(!client.guilds.cache.get(guildID)) return;

        let date = moment().format('DD/MM/YYYY');

        client.stats_db.ensure(`${guildID}-${date}`, default_stats);
        client.stats_array.ensure(guildID, []);

        let oldValue = client.stats_db.get(`${guildID}-${date}`, key);
        
        let newValue = oldValue + 1;

        save(guildID, key, newValue);

        return get(guildID, date);

    };

    client.stats = {
        save: save,
        get: get,
        inc: inc
    };

}