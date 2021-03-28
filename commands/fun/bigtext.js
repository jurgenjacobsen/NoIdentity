const num_conv = require('number-to-words')

exports.run = async (Discord, client, message, args, i18n) => {

    const NoText = client.embed(i18n.__("command.bigtext.errors.notext"))

    let output = args.join(' ');
    
    if (!output) return message.channel.send(message.author, NoText);

    message.channel.startTyping();
    let bigtext_arr = new Array();

    for (let i = 0; i < output.length; i++) {
        let isnumber = await parseInt(output[i]);
        if (isnumber >= 0 && isnumber <= 9)
            bigtext_arr.push(`:${num_conv.toWords(output[i])}:`)
        else {
            if (output[i] !== ' ') {
                if (!output[i].match(/^[a-zA-Z]+$/))
                    bigtext_arr.push(`:question:`)
                else
                    bigtext_arr.push(`:regional_indicator_${output[i].toLowerCase()}:`)
            } else bigtext_arr.push('   ');
        }
    }

    try {
        await message.reply(bigtext_arr.join(''));
    } catch (e) {
        const Err = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(i18n.__("command.bigtext.errors.error"));
        return message.channel.send(message.author, Err)
    }
    message.channel.stopTyping(true);
};

exports.config = {
    name: 'bigtext',
    enabled: true,
	guildOnly: false,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'bigtext',
    category: "Diversão",
    description: "Transforma um texto em emoji",
    usage: "bigtext {texto}"
};