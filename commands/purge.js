exports.run = async (Discord, client, message, args) => {
    try {

        let perm = message.member.hasPermission(['MANAGE_CHANNELS']) || message.member.hasPermission('ADMINISTRATOR') || message.author.id == client.config.ownerID;
    
        let amountSizeErr = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription('Você deve selecionar entre 1 ou 100 mensagens!');
    
        let permErr = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription('Você não possui permissões pra isso!');
    
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
                .setDescription(`Apaguei **${deleteAmount}** no canal ${message.channel}.`);
                message.channel.send(message.author, purgeComplete).then(x => x.delete({timeout: 15000}));
            });
        })
        .catch(err => console.log('Erro no comando purge.js'))
    } catch(err) {
        console.log('Erro no comando purge.js')
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
	usage: 'purge {número-de-mensagens}'
};