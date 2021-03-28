
exports.run = async (Discord, client, message, args, i18n) => {

    await client.economy.checkForMonthly(message.guild.id, message.author.id, i18n, message);
 
 };
 
 exports.config = {
     name: 'salary',
     enabled: true,
     guildOnly: true,
     aliases: ['salario', 'salário', 'auxilio', 'auxílio'],
     permissions: ['SEND_MESSAGES']
 };
 
 exports.help = {
     name: 'salary',
     category: "Economia",
     description: "Pega seu salário",
     usage: "salary"
 };