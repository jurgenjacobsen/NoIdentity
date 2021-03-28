
exports.run = async (Discord, client, message, args, i18n) => {
    const ms = require('parse-ms');
    let timeout = 900000;

    let delay = client.balance.get(`${message.guild.id}-${message.author.id}`).stats.giftTimeout;

    if(delay !== null && timeout - (Date.now() - delay) > 0) {
        let time = ms(timeout - (Date.now() - delay));

        message.channel.send(message.author, client.embed(`:alarm_clock: | ` + i18n.__mf("command.gift.responses.timeout", {
            minutes: time.minutes,
            seconds: time.seconds
        })));

    } else {
        
        let value = args[1];
        let toUser = message.mentions.members.first();

        if(!toUser) return message.channel.send(message.author, client.embed(i18n.__("command.gift.errors.noUser")));
        if(toUser.user.bot || message.author.id === toUser.user.id) return message.channel.send(message.author, client.embed(i18n.__("command.gift.errors.invalidUser")));

        if(!args[1]) return message.channel.send(message.author, client.embed(i18n.__("command.gift.errors.amountInvalid")));
        if(args[1].startsWith('-')) return message.channel.send(message.author, client.embed(i18n.__("command.gift.errors.amountInvalid")));
        if(isNaN(args[1])) return message.channel.send(message.author, client.embed(i18n.__("command.gift.errors.amountInvalid")));

        value = parseInt(args[1]);

        await create(message, toUser.user.id, i18n, value);

    }

    async function create(message, toID, i18n, value) {

        if(message.guild) {

            client.balance.ensure(`${message.guild.id}-${message.author.id}`, {
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

            let userAccount = client.balance.get(`${message.guild.id}-${message.author.id}`);

            if(message.guild.members.cache.get(toID)) {
                if(userAccount.money >= value) {

                    function makeid() {
                        var result           = '';
                        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;
                        for ( var i = 0; i < 6; i++ ) {
                           result += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                        return result;
                    };

                    const ID = makeid();
                    const bonus = 1.10;

                    const giftCard = {
                        id: ID,
                        obs: '' ? '' : null,
                        fromID: message.author.id,
                        toID: toID,
                        guildID: message.guild.id,
                        value: value * bonus,
                        createdAt: Date.now(),
                        redeemedAt: null
                    };

                    if(!client.presentes.get(ID)) {
                        client.presentes.set(ID, giftCard);
                        client.economy.removeMoney(message.guild.id, message.author.id, value);
                    
                        client.balance.set(`${message.guild.id}-${message.author.id}`, Date.now(), 'stats.giftTimeout');
                        
                        client.usersdata.ensure(toID, client.config.default.user_settings);

                        client.usersdata.push(message.author.id, {
                            type: 'GIFT_GENERATED',
                            data: {
                                redeemedBy: null,
                                fromID: message.author.id,
                                toID: toID,
                                redeemedAt: Date.now(),
                                value: value * bonus,
                                giftID: ID,
                                time: Date.now()
                            }
                        }, "profile.logs");

                        if(toID !== '@everyone') {
                            client.usersdata.push(toID, {
                                type: 'GIFT_RECEIVED',
                                data: {
                                    redeemedBy: null,
                                    fromID: message.author.id,
                                    redeemedAt: Date.now(),
                                    value: value * bonus,
                                    giftID: ID,
                                    time: Date.now()
                                }
                            }, "profile.logs");

                            client.usersdata.push(toID, ID, "profile.gifts");

                            client.log(`GIFT`, `[${ID}] ${message.author.tag} [${message.author.id}] enviou um presente para ${toID}`);

                            message.channel.send(message.author, client.embed(i18n.__mf("command.gift.responses.youvesent", {
                                toID: toID
                            })))

                            await message.author.send(client.embed(`🎁 | ${i18n.__mf("command.gift.responses.sent", {
                                toID: toID,
                                ID: ID
                            })}`));

                        } else {
                            await message.author.send(client.embed(i18n.__("command.gift.reponses.withoutOwner")));
                            message.channel.send(message.author, client.embed(i18n.__("command.gift.responses.warn")));
                        }

                    } else {
                        message.channel.send(message.author, client.embed(i18n.__("command.gift.responses.alreadyExists")))
                    }
                } else {
                    message.channel.send(message.author, client.embed(i18n.__("command.gift.responses.notEnoughMoney")));
                }
            }
        }

    };

};
 
exports.config = {
    name: 'gift',
    enabled: true,
    guildOnly: true,
    aliases: ['presente'],
    permissions: ['SEND_MESSAGES']
};
 
exports.help = {
    name: 'gift',
    category: "Economia",
    description: "Envie presentes para as pessoas com um bonus de 5%",
    usage: "gift"
};