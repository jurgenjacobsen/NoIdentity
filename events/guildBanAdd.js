module.exports = (client, guild, user) => {

    client.stats.inc(guild.id, 'guildBanAdd');

}