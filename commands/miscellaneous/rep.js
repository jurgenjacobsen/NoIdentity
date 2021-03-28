const ms = require('parse-ms');

exports.run = async (Discord, client, message, args, i18n) => {
	
    let timeout = 72000000;
    let delay = await client.usersdata.get(message.author.id).rep_timeout;

    if(!message.mentions.members.first()) return message.channel.send(message.author, client.embed(i18n.__mf("command.rep.responses.nouser")));
    if(message.mentions.members.first().id === message.author.id) return message.channel.send(message.author, client.embed(i18n.__mf("command.rep.responses.notsame")));

    if(delay !== null && timeout - (Date.now() - delay) > 0) {

        let time = ms(timeout - (Date.now() - delay));

        message.channel.send(message.author, client.embed(i18n.__mf("command.rep.responses.timeout", {
            hours: time.hours,
            minutes: time.minutes
        })));

    } else {

        let member = message.mentions.members.first();
        if(message.guild.members.cache.get(member.id)) {

            client.usersdata.ensure(member.id, client.config.default.user_settings);

            if(client.usersdata.get(message.author.id).isPremium) {

                client.usersdata.inc(member.id, 'profile.reps');
                client.usersdata.inc(member.id, 'profile.reps');

                message.channel.send(message.author, client.embed(i18n.__mf("command.rep.responses.reppremium", {
                    userID: member.id
                })));

            } else {

                client.usersdata.inc(member.id, 'profile.reps');

                message.channel.send(message.author, client.embed(i18n.__mf("command.rep.responses.reps", {
                    userID: member.id
                })));

            };

            client.usersdata.set(message.author.id, Date.now(), 'rep_timeout');

        } else {
            message.channel.send(message.author, client.embed(i18n.__("command.rep.responses.notamember")));
        };
        
    }

};

exports.config = {
    name: 'rep',
    enabled: true,
	guildOnly: true,
    aliases: ['reputation'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'rep',
	category: 'Diversos',
	description: 'Dá um ponto de reputação à uma pessoa.',
	usage: 'rep @user'
};