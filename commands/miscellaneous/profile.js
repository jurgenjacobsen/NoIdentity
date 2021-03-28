exports.run = async (Discord, client, message, args, i18n) => {
    const Canvas = require("discord-canvas");
    const validImageRegex = /(http(s?):)([/|.|\w|\s|-])*.(?:jpg|gif|png|jpeg)/g;
   
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    client.usersdata.ensure(member.id, client.config.default.user_settings);
    const usersdata = client.usersdata.get(member.id);

    const key = `${message.guild.id}-${member.id}`;

    client.balance.ensure(key, {
        user: member.id,
        guild: message.guild.id,
        money: 0,
        stats: {
            dailies: 0,
            lastTimeDaily: null,
            monthlies: 0,
            lastTimeMonthly: null,
            works: 0,
            lastTimeWorked: null,
            votes: 0,
            betTimeout: null,
            giftTimeout: null,
        }
    });

    let points;
    let level;
    let rank;
    let pointsRequired;
    let background;
    let role;

    if(client.points.get(key)) {
        let position = [];
        const filtered = client.points.filter( p => p.guild === message.guild.id ).array();
        const sorted = filtered.sort((a, b) => b.points - a.points);

        points = client.points.get(key, "points");
        level = client.points.get(key, "level");

        for(const data of sorted) {
            position.push('0');
            if(data.user === member.id) {
                rank = position.length;
                break;
            }
        }

        var
        pointsNextLevel = Math.pow((level + 1) * 4, 2);
        pointsRequired = pointsNextLevel - points;

    } else {

        points = 0;
        level = 0;
        rank = 0;
        pointsRequired = 0;

    };

    if(validImageRegex.test(usersdata.profile.cardBackground)) {
        background = usersdata.profile.cardBackground;
    } else {
        background = "https://noid.one/assets/images/profile_background.jpg";
    };

    if(usersdata.profile.role == 'Desenvolvedor') {
        role = i18n.__("command.profile.responses.dev")
    } else if(usersdata.profile.role == 'Bughunter') {
        role = i18n.__("command.profile.responses.bughunter")
    } else if(usersdata.isPremium) {
        role = i18n.__("command.profile.responses.premium")
    } else {
        role = ''
    }


    message.channel.startTyping();
    let image = await new Canvas.RankCard(client, member, message)
      .setAvatar(member.user.displayAvatarURL().replace('webp', 'png').replace('gif', 'png').replace('jpg', 'png').replace('jpeg', 'png'))
      .setBackground(background) // https://noid.one/assets/images/profile_background.jpg
      .setXP("current", points)
      .setXP("needed", pointsRequired)
      .setRadius(25)
      .setLevel(level)
      .setRank(rank)
      .setBadge(1, "gold")
      .setBadge(2, "gold")
      .setBadge(3, "gold")
      .setBadge(4, "gold")
      .setBadge(5, "gold")
      .setBadge(6, "gold")
      .setRankName(role)
      .setTextNeededXP(i18n.__("command.profile.responses.textNeeded"))
      .setReputation(usersdata.profile.reps)
      .setColor('#8855ff')
      .setUsername(member.user.username)
      .toAttachment();

    const attachment = new Discord.MessageAttachment(image.toBuffer(), "profile.png");
   
    message.channel.send(attachment);
    message.channel.stopTyping(true);
};

exports.config = {
    name: 'profile',
    enabled: true,
	guildOnly: true,
    aliases: ['perfil'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'profile',
	category: 'Diversos',
	description: 'Mostra o seu perfil.',
	usage: 'profile'
};