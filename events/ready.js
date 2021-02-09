module.exports = async client => {

    client.appInfo = await client.fetchApplication();
	setInterval(async () => {
		client.appInfo = await client.fetchApplication();
    }, 60000);

    require('../modules/website.js')(client);

    if(client.config.dblActive) {
        client.dbl.postStats(client.guilds.size, client.shard.id, client.shard.total).then(() => {
          setInterval(() => {
            client.dbl.postStats(client.guilds.size, client.shard.id, client.shard.total);
          }, 1800000);
        }).catch(err => client.log('DBL API', 'Não foi possível enviar as informações para o API'));
    };

    client.log('DBL API', 'Informações enviadas ao DBL!');

    client.appInfo = await client.fetchApplication();
	setInterval(async () => {
		client.appInfo = await client.fetchApplication();
    }, 60000);

    client.user.setPresence({
        activity: {
            name: client.config.start.presence.text,
            type: client.config.start.presence.type,
            url: client.config.start.presence.url 
        },
        status: client.config.start.presence.status
    });

    await client.radioSearch();
    await client.datacheck();

    client.log('CLIENT', `Pronto!\n ${client.users.cache.size.toLocaleString()} usuários e ${client.guilds.cache.size.toLocaleString()} servidores`);
};