const weather = require('weather-js');

exports.run = async (Discord, client, message, args) => {
    weather.find({search: args.join(" "), degreeType: 'C'}, function (error, result){
        
        let Error = new Discord.MessageEmbed().setColor(client.config.color).setDescription('*Houve um erro ao procurar o clima.*');
        let NoLocation = new Discord.MessageEmbed().setColor(client.config.color).setDescription('*Diga o local que você queira!*');
        let NotFound = new Discord.MessageEmbed().setColor(client.config.color).setDescription('*Não encontrei este local!*');
        

        if(error) return message.channel.send(message.author, Error);
        if(!args[0]) return message.channel.send(message.author, NoLocation);
        if(result === undefined || result.length === 0) return message.channel.send(message.author, NotFound);

        var current = result[0].current;
        var location = result[0].location;

        let skytext = {
            'Mostly Sunny': 'Ensolarado',
            'Sunny': 'Ensolarado',
            'Light Rain': 'Chuva fraca',
            'Rainny': 'Chuvoso',
            'Snow': 'Nevando',
            'Mostly Cloudy': 'Nublado',
            'Cloudy': 'Nublado',
            'Haze': 'Névoa',
            'Partly Sunny': 'Parcialmente Ensolarado',
            'Rain Showers': 'Tromba d\'água'
        };

        const weatherinfo = new Discord.MessageEmbed()
        .setDescription(`**${skytext[current.skytext]}**`)
        .setAuthor(`Previsão do tempo em ${current.observationpoint}`)
        .setThumbnail(current.imageUrl)
        .setColor(client.config.color)
        .addField('Fuso horário', `UTC${location.timezone}`, true)
        .addField('Tipo de grau', 'Celsius', true)
        .addField('Temperatura', `${current.temperature}°`, true)
        .addField('Vento', current.winddisplay, true)
        .addField('Sensação térmica', `${current.feelslike}°`, true)
        .addField('Humidade', `${current.humidity}%`, true)


        message.channel.send(message.author, weatherinfo)
    });
};

exports.config = {
    name: 'clima',
    enabled: true,
	guildOnly: false,
    aliases: ['weather'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'clima',
	category: 'Diversos',
	description: 'Diz a previsão do clima de um local',
	usage: 'clima {local}'
};