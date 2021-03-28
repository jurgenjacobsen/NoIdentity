const { MessageEmbed } = require("discord.js");

exports.run = async (Discord, client, message, args, i18n) => {

    if(message.member.hasPermission(['MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']) || message.member.hasPermission(['ADMINISTRATOR']) || message.author.id === client.config.ownerID || message.author.id === message.guild.owner.id) {

        const Embed = new MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`
        **${i18n.__("command.reset.responses.title")}**\n
        <:wumpus_star:794707740198043668> - ${i18n.__("command.reset.responses.lvlList")} \n
        <:coin:813944477248126986> - ${i18n.__("command.reset.responses.economyEconomy")} \n
        <:worker:804839799374610482> - ${i18n.__("command.reset.responses.guildConfigs")} \n
        `)

        let msg = await message.channel.send(message.author, Embed);
            msg.react(`794707740198043668`).then(() => msg.react(`813944477248126986`).then(() => msg.react(`804839799374610482`)));

        const filter = (reaction, user) => {
            return user.id === message.author.id;
        };
    
        const collector = msg.createReactionCollector(filter, {maxUsers: 2, time: 60000, errors: ['time']});

        collector.on('collect', async (reaction, user) => {

            if(reaction.emoji.id === `794707740198043668`) {

                await collector.stop();
                await msg.reactions.removeAll();
                await resetGuild(message, msg, 'LEVELS', i18n);
                
            } else if(reaction.emoji.id === `813944477248126986`) {

                await collector.stop();
                await msg.reactions.removeAll();
                await resetGuild(message, msg, 'ECONOMY', i18n);
                
            } else if(reaction.emoji.id === `804839799374610482`) {
                
                await collector.stop();
                await msg.reactions.removeAll();
                await resetGuild(message, msg, 'CONFIG', i18n);

            }
        });

    } else {
        message.channel.send(message.author, client.embed(i18n.__("command.cleanup.errors.noperm")))
    }

    const resetGuild = async(message, msg, type, i18n) => {

        if(!message && !msg) return;

        let confirm;

        if(type === 'LEVELS') {
            confirm = await msg.edit(message.author, client.embed(`<:alert:794707740199092254> | ${i18n.__("command.reset.responses.reset.levels")}`));
        } else if(type === 'ECONOMY') {
            confirm = await msg.edit(message.author, client.embed(`<:alert:794707740199092254> | ${i18n.__("command.reset.responses.reset.economy")}`));
        } else if(type === 'CONFIG') {
            confirm = await msg.edit(message.author, client.embed(`<:alert:794707740199092254> | ${i18n.__("command.reset.responses.reset.configs")}`));
        }

        confirm.react('785248178752585750').then(() => confirm.react('785248178836340747'))

        const filter = (reaction, user) => {
            return user.id === message.author.id;
        };

        let collector = await confirm.createReactionCollector(filter, {maxUsers: 2, time: 60000, errors: ['time']});

        collector.on('collect', async (reaction, user) => {

            if(reaction.emoji.id === `785248178752585750`) {

                if(type === 'LEVELS') {

                    let users = client.points.filter(p => p.guild === message.guild.id);

                    users.forEach(data => {
                        client.points.delete(`${message.guild.id}-${data.user}`);
                    });

                    await collector.stop();
                    await msg.reactions.removeAll();
                    await msg.edit(message.author, client.embed(`<:sim:678281143396859962> | ${i18n.__mf("command.reset.responses.lvlClear", {usersSize: users.size})}`));

                } else if(type === 'ECONOMY') {

                    let users = client.balance.filter(p => p.guild === message.guild.id);

                    users.forEach(data => {
                        client.balance.delete(`${message.guild.id}-${data.user}`);
                    });

                    await collector.stop();
                    await msg.reactions.removeAll();
                    await msg.edit(message.author, client.embed(`<:sim:678281143396859962> | ${i18n.__mf("command.reset.responses.economy", {usersSize: users.size})}`));

                } else if(type === 'CONFIG') {
                    await collector.stop();
                    await msg.reactions.removeAll();
                    await msg.edit(message.author, client.embed(`${i18n.__("command.reset.responses.website")} https://noid.one/config/${message.guild.id}?type=guild`))
                }

            } else if(reaction.emoji.id === `785248178836340747`) {
                await collector.stop();
                await msg.reactions.removeAll();

                confirm.edit(client.embed(`${i18n.__("command.reset.responses.canceled")}`));
                confirm.delete({timeout: 10000});
                message.delete({timeot: 10000});
            }

        });

    }


};

exports.config = {
    name: 'reset',
    enabled: true,
	guildOnly: true,
	aliases: [],
    permissions: ['SEND_MESSAGES', 'ADD_REACTIONS']
};

exports.help = {
	name: 'reset',
	category: "Moderação",
    description: "Reseta algumas opções do banco de dados do bot em seu servidor.",
    usage: "reset"
};