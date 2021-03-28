exports.run = async (Discord, client, message, args, i18n) => {
    try {

        let perm = message.member.hasPermission(['MANAGE_CHANNELS', 'MANAGE_MESSAGES']) || message.member.hasPermission('ADMINISTRATOR') || message.author.id == client.config.ownerID;
    
        let amountSizeErr = client.embed(i18n.__("command.purge.errors.amountSizeErr"));
    
        let permErr = client.embed(i18n.__("command.purge.errors.permErr"));
    
        if(!perm) return message.channel.send(message.author, permErr);

        let deleteAmount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1]);
        if(!deleteAmount) return message.channel.send(message.author, amountSizeErr);

        if(deleteAmount > 100) {
            deleteAmount = 100;
        }

        message.channel.messages.fetch({ limit: deleteAmount })
        .then(msgs => {
            message.channel.bulkDelete(msgs).then(confirm => {
                let purgeComplete = new Discord.MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`${i18n.__mf("command.purge.responses.description", {
                    deleteAmount: deleteAmount
                })} ${message.channel}.`);
                message.channel.send(message.author, purgeComplete).then(x => x.delete({timeout: 5000}));
            });
        })
        .catch(err => console.log(err))
    } catch(err) {
        console.log(err)
    }
};

exports.config = {
    name: 'purge',
    enabled: true,
	guildOnly: true,
	aliases: ['clear'],
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
};

exports.help = {
	name: 'purge',
	category: 'Moderação',
	description: 'Apaga as mensagem em um canal',
	usage: 'purge <número-de-mensagens>'
};