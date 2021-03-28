module.exports = async client => {

    client.appInfo = await client.fetchApplication();
	setInterval(async () => {
		client.appInfo = await client.fetchApplication();
    }, 60000);

    if(client.config.topggPost) {
        client.topgg.postStats({
            serverCount: client.guilds.cache.size,
            shardId: client.shard.ids[0],
            shardCount: client.options.shardCount
        });
        setInterval(() => {
            client.topgg.postStats({
              serverCount: client.guilds.cache.size,
              shardId: client.shard.ids[0],
              shardCount: client.options.shardCount
            });
            client.log('TOPGG API', 'Informações atualizadas em TOPGG!');
        }, 1800000);

        client.log('TOPGG API', 'Informações enviadas ao TOPGG!');
    };

    client.appInfo = await client.fetchApplication();
	  setInterval(async () => {
		  client.appInfo = await client.fetchApplication();
    }, 60000);

    require('../modules/website.js')(client);

    let totalUsers = 0;

    client.guilds.cache.map(guild => {
        totalUsers += guild.memberCount;
        client.totalUsers = Math.round(totalUsers/2);
    });

    setInterval(() => {
        client.guilds.cache.map(guild => {
            if(guild.premiumSubscriptionCount >= 1) {
                client.settings.set(guild.id, true, 'profile.isBoosted');
            } else {
                client.settings.set(guild.id, false, 'profile.isBoosted');
            };

            if(client.usersdata.has(guild.ownerID)) {
                if(client.usersdata.get(guild.ownerID).isPremium || guild.ownerID === client.config.ownerID) {
                    client.settings.set(guild.id, true, 'profile.isPremium');
                } else {
                    client.settings.set(guild.id, false, 'profile.isPremium');
                }
            } else {
                client.settings.set(guild.id, false, 'profile.isPremium');
            };
        });
    }, 600000);

    setInterval(() => {
      const activityTextList = Math.floor(Math.random() * client.config.start.presence.texts.length);

      client.user.setPresence({
          activity: {
              name: client.config.start.presence.texts[activityTextList],
              type: client.config.start.presence.type,
              url: client.config.start.presence.url 
          },
          status: client.config.start.presence.status
      });

    }, 20000);

    client.user.setPresence({ status: 'online', activity: { name: 'música da boa!', type: 'LISTENING', } });

    client.projects.autouptade();

    client.log('CLIENT', `Pronto!\n ${client.totalUsers.toLocaleString()} usuários e ${client.guilds.cache.size.toLocaleString()} servidores`);
};