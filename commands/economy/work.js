
exports.run = async (Discord, client, message, args, i18n) => {
    await client.economy.work(message.guild.id, message.author.id, i18n, message)
};
 
exports.config = {
    name: 'work',
    enabled: true,
    guildOnly: true,
    aliases: ['trabalhar', 'trabajar'],
    permissions: ['SEND_MESSAGES']
};
 
exports.help = {
    name: 'work',
    category: "Economia",
    description: "Trabalhe a cada 6 horas para receber seu dinheiro",
    usage: "work"
};