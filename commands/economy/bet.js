exports.run = async (Discord, client, message, args, i18n) => {

    const ms = require('parse-ms');

    const key = `${message.guild.id}-${message.author.id}`;

    client.balance.ensure(key, {
        user: message.author.id,
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

    let timeout = 8000;
    let delay = await client.balance.get(key).stats.betTimeout;

    if(delay !== null && timeout - (Date.now() - delay) > 0) {

        let time = ms(timeout - (Date.now() - delay));

        return message.channel.send(message.author, client.embed(`:alarm_clock: | ` + i18n.__mf("command.bet.responses.timeout", {
            minutes: time.minutes,
            seconds: time.seconds
        })));

    }

    let user_balance = client.balance.get(key).money;

    function isOdd(num) { 
        if (num == 3 && num !== 0) return false;
        else if (num !== 0 && num == 6) return true;
    }
        
    let colour = args[0];
    let money = parseInt(args[1]);
    let moneydb = user_balance;
    
    let udb = client.usersdata.get(message.author.id);

    let random; 
    if(udb.isStaff) {
        random = Math.floor(Math.random() * 27);
    } else if(udb.isPremium) {
        random = Math.floor(Math.random() * 28);
    } else {
        random = Math.floor(Math.random() * 30);
    }
    
    if (!colour)  return message.channel.send(message.author, client.embed(i18n.__("command.bet.responses.colorbad")));
    if (!money) return message.channel.send(message.author, client.embed(i18n.__("command.bet.responses.noAmount"))); 
    if (money >= moneydb) return message.channel.send(message.author, client.embed(i18n.__("command.bet.responses.notAvaliable")));
    if(args[1].startsWith('-')) return message.channel.send(message.author, client.embed(i18n.__("command.bet.responses.noValidAmount")))
    if(parseInt(args[1]) === 0) return message.channel.send(message.author, client.embed(i18n.__("command.bet.responses.noValidAmount")))
    if(parseInt(args[1]) >= 1501) return message.channel.send(message.author, client.embed(i18n.__("command.bet.responses.max")));
        
    colour = colour.toLowerCase();

    if (colour == "b" || colour == "p" || colour.includes("black") || colour.includes("preto")) colour = 0;
    else if (colour == "r" || colour.includes("vermelho") || colour.includes("red")) colour = 1;
    else if (colour == "g" || colour.includes("verde") || colour.includes("green")) colour = 2;    

    else return message.channel.send(client.embed(i18n.__("command.bet.responses.colorbad")));
        
        
        
        if (random == 0 && colour == 2) { // Green

            money *= 15;

            client.economy.addMoney(message.guild.id, message.author.id, money);
            
            let moneyEmbed1 = new Discord.MessageEmbed()
            .setColor("#43b581")
            .setDescription(`<:coin:813944477248126986>🎉 ${i18n.__mf("command.bet.responses.green", {money: money})}`);

            message.channel.send(message.author, moneyEmbed1);

            client.balance.set(key, Date.now(), 'stats.betTimeout');

        } else if (random >= 11 && random <= 22 && colour == 1) { // Red

            money = parseInt(money * 1.5);

            client.economy.addMoney(message.guild.id, message.author.id, money);

            let moneyEmbed2 = new Discord.MessageEmbed()
            .setColor("#f04747")
            .setDescription(`<:coin:813944477248126986> ${i18n.__mf("command.bet.responses.red", {money: money})}`);

            message.channel.send(message.author, moneyEmbed2);

            client.balance.set(key, Date.now(), 'stats.betTimeout');

        } else if (random >= 1 && random <= 10 && colour == 0) { // Black

            money = parseInt(money * 2);

            client.economy.addMoney(message.guild.id, message.author.id, money);

            let moneyEmbed3 = new Discord.MessageEmbed()
            .setDescription(`<:coin:813944477248126986> ${i18n.__mf("command.bet.responses.black", {money: money})}`);

            message.channel.send(message.author, moneyEmbed3);

            client.balance.set(key, Date.now(), 'stats.betTimeout');

        } else { // Wrong

            client.economy.removeMoney(message.guild.id, message.author.id, money);
            
            let moneyEmbed4 = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setDescription(`<:coin:813944477248126986> ${i18n.__mf("command.bet.responses.lost", {money: money})}`);

            message.channel.send(message.author, moneyEmbed4);

            client.balance.set(key, Date.now(), 'stats.betTimeout');

        };
    
 };
 
 exports.config = {
     name: 'bet',
     enabled: true,
     guildOnly: true,
     aliases: ['apostar'],
     permissions: ['SEND_MESSAGES']
 };
 
 exports.help = {
     name: 'bet',
     category: "Economia",
     description: "Aposte seu dinheiro aqui, talvez você fique pobre",
     usage: "bet"
 };