const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;

exports.run = async (Discord, client, message, args, i18n) => {

    if (!args.length) return message.channel.send(client.embed(i18n.__("command.remfavsongs.noargs")));
    if (!client.usersdata.get(message.author.id) || !client.usersdata.get(message.author.id).profile.fav_songs.length >= 1) return message.channel.send(client.embed(i18n.__("command.remfavsongs.nofavs")));
	const arguments = args.join("");
    const songs = arguments.split(",").map((arg) => parseInt(arg));
    let removed = [];

	if (pattern.test(arguments)) {

		if(parseInt(args[0]) > client.usersdata.get(message.author.id).profile.fav_songs.length) return message.channel.send(client.embed(i18n.__("command.remfavsongs.notesongs")));

		let songsToKeep = client.usersdata.get(message.author.id).profile.fav_songs.filter((item, index) => {
			if(songs.find((songIndex) => songIndex - 1 === index)) removed.push(item);
		  	else return true;
		});
  
        client.usersdata.ensure(message.author.id, client.config.default.user_settings);

        client.usersdata.set(message.author.id, songsToKeep, "profile.fav_songs");

		message.channel.send(message.author, client.embed(`⭐ | ${i18n.__("command.remfavsongs.didit")}:\n **${removed.map((song) => song.title).join("\n")}**`).setColor('#8855ff'));

	} else {
		return message.channel.send(client.embed(i18n.__("command.remove.errors.noargs")));
	}

};

exports.config = {
    name: 'remfavsongs',
    enabled: true,
	guildOnly: true,
    aliases: ['rf', 'remfavsongs'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'remfavs',
	category: 'Música',
	description: 'Remove músicas da sua lista de favoritos',
	usage: 'rf <número da música na sua lista>'
};