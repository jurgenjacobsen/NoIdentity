
exports.run = async (Discord, client, message, args, i18n) => {

    let toUserID = message.mentions.members.first();

    if(!toUserID) return message.channel.send(message.author, client.embed(i18n.__("command.pay.errors.nomention")));

    toUserID = toUserID.id;

    if(toUserID === client.user.id) return message.channel.send(message.author, client.embed(i18n.__("command.pay.errors.bot")));
    if(!args[1]) return message.channel.send(message.author, client.embed(i18n.__("command.pay.errors.noamount")));
    if(args[1].startsWith('-')) return message.channel.send(message.author, client.embed(i18n.__("command.bet.responses.noValidAmount")))

    if(isNaN(args[1])) return message.channel.send(message.author, client.embed(i18n.__("command.pay.errors.isnan")));

    await client.economy.pay(message.author.id, toUserID, args[1], message.guild.id, i18n, message);
 
 };
 
 exports.config = {
     name: 'pay',
     enabled: true,
     guildOnly: true,
     aliases: ['pagar', 'agiota'],
     permissions: ['SEND_MESSAGES']
 };
 
 exports.help = {
     name: 'pay',
     category: "Economia",
     description: "Pague alguém com seu dinheiro",
     usage: "pay <@user> <quantia>"
 };