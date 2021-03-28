
exports.run = async (Discord, client, message, args, i18n) => {

    let user = message.mentions.members.first() || message.author;
        user = user.id;

    await client.economy.bal(message.guild.id, user, i18n, message);
};
 
exports.config = {
    name: 'bal',
    enabled: true,
    guildOnly: true,
    aliases: ['balance', 'carteira', 'bank', 'banco'],
    permissions: ['SEND_MESSAGES']
};
 
exports.help = {
    name: 'bal',
    category: "Economia",
    description: "Veja as suas informações bancárias ou de outros membros",
    usage: "bal"
};