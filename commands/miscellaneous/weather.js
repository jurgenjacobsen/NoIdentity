const weather = require('weather-js');

exports.run = async (Discord, client, message, args, i18n) => {
    let Error = client.embed(i18n.__("command.weather.errors.error"))
    let NoLocation = client.embed(i18n.__("command.weather.errors.noargs"))
    let NotFound = client.embed(i18n.__("command.weather.errors.notfound"))
        
    if(!args[0]) return message.channel.send(message.author, NoLocation);
    
    weather.find({search: args.join(" "), degreeType: 'C'}, function (error, result){

        if(error) return message.channel.send(message.author, Error);
        if(result === undefined || result.length === 0) return message.channel.send(message.author, NotFound);

        var current = result[0].current;
        var location = result[0].location;

        let skytext = {
            'Mostly Sunny': i18n.__("command.weather.responses.skytext.MostlySunny"),
            'Sunny': i18n.__("command.weather.responses.skytext.Sunny"),
            'Light Rain': i18n.__("command.weather.responses.skytext.LightRain"),
            'Rainny': i18n.__("command.weather.responses.skytext.Rainny"),
            'Snow': i18n.__("command.weather.responses.skytext.Snow"),
            'Mostly Cloudy': i18n.__("command.weather.responses.skytext.MostlyCloudy"),
            'Cloudy': i18n.__("command.weather.responses.skytext.Cloudy"),
            'Haze': i18n.__("command.weather.responses.skytext.Haze"),
            'Partly Sunny': i18n.__("command.weather.responses.skytext.PartlySunny"),
            'Rain Showers': i18n.__("command.weather.responses.skytext.RainShowers")
        };

        const weatherinfo = new Discord.MessageEmbed()
        .setDescription(`**${skytext[current.skytext] ? skytext[current.skytext] : '...'}**`)
        .setAuthor(`${i18n.__("command.weather.responses.weather_forecast")} ${current.observationpoint}`)
        .setThumbnail(current.imageUrl)
        .setColor(client.config.color)
        .addField(`${i18n.__("command.weather.responses.time_zone")}`, `UTC${location.timezone}`, true)
        .addField(`${i18n.__("command.weather.responses.degreeType")}`, 'Celsius', true)
        .addField(`${i18n.__("command.weather.responses.temperature")}`, `${current.temperature}°`, true)
        .addField(`${i18n.__("command.weather.responses.wind")}`, current.winddisplay, true)
        .addField(`${i18n.__("command.weather.responses.feelsLike")}`, `${current.feelslike}°`, true)
        .addField(`${i18n.__("command.weather.responses.humidity")}`, `${current.humidity}%`, true)


        message.channel.send(message.author, weatherinfo)
    });
};

exports.config = {
    name: 'weather',
    enabled: true,
	guildOnly: false,
    aliases: ['clima'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'clima',
	category: 'Diversos',
	description: 'Diz a previsão do clima de um local',
	usage: 'clima {local}'
};