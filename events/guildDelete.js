const Discord = require("discord.js");

module.exports = async (client, guild) => {
    await client.settings.delete(guild.id);
  
    if(!guild.name) return;

    const Embed = new Discord.MessageEmbed()
    .setColor(client.config.color)
    .setDescription(`Acabei de sair do servidor **${guild.name}**`)
    .setTimestamp();

    client.channels.cache.get(client.config.bot_guild.logs_channel).send(Embed);

    client.log(`GUILD`, `Fui removido do servidor: ${guild.name} (${guild.id})`)
};