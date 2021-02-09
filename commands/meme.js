const randomPuppy = require('random-puppy');

exports.run = async (Discord, client, message, args) => {
	const subReddits = ["memes"]
    const random = subReddits[Math.floor(Math.random() * subReddits.length)]

    randomPuppy(random)
    .then(url => {
        if(!url.endsWith('.mp4')) {
            url = url.replace('http', 'https');
            const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setImage(url)
            .setTitle(`Seu meme, vindo de r/${random}`)
            .setURL(`https://reddit.com/r/${random}`);
            message.channel.send(message.author, embed);
            url = url.replace('http', 'https');
        } else {
            message.channel.send(`${message.author}, **${url}**`)
        };
    })
    .catch(err => console.log(err));
};

exports.config = {
    name: 'meme',
    enabled: true,
	guildOnly: false,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'meme',
	category: 'Diversão',
	description: 'Faz seu dia um pouquinho melhor com algum meme',
	usage: 'meme'
};