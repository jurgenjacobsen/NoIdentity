
const Discord = require("discord.js");

module.exports = async (client, guild) => {

    await client.settings.set(guild.id, client.config.default.guild_settings);
    await client.settings.set(guild.id, guild.id, 'id');

    const Embed = new Discord.MessageEmbed()
    .setColor(client.config.color)
    .setDescription(`Acabei de entrar no servidor **${guild.name}**`)
    .setTimestamp()
    client.channels.cache.get(client.config.bot_guild.logs_channel).send(Embed);

    client.log(`GUILD`, `Fui adicionado ao servidor: ${guild.name} (${guild.id})`)
};