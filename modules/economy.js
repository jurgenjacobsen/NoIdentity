const Discord = require('discord.js');

module.exports = async client => {

    const randomAmount = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    const get = async (guildID, userID) => {
        const key = `${guildID}-${userID}`;

        client.balance.ensure(key, {
            user: userID,
            guild: guildID,
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

        return client.balance.get(key);
    };

    const setMoney = (guildID, userID, moneyAmount) => {
        const key = `${guildID}-${userID}`;

        client.balance.ensure(key, {
            user: userID,
            guild: guildID,
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

        client.balance.set(key, parseInt(moneyAmount), 'money');

        return client.balance.get(key);
    };

    const addMoney = (guildID, userID, moneyAmount) => {
        const key = `${guildID}-${userID}`;

        client.balance.ensure(key, {
            user: userID,
            guild: guildID,
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

        let newMoneyAmount = parseInt(client.balance.get(key).money) + parseInt(moneyAmount);

        client.usersdata.ensure(userID, client.config.default.user_settings);
        client.usersdata.math(userID, "+", Math.floor(moneyAmount), "profile.money");

        client.balance.set(key, newMoneyAmount, 'money');

        return client.balance.get(key);
    };

    const removeMoney = (guildID, userID, moneyAmount) => {
        const key = `${guildID}-${userID}`;

        client.balance.ensure(key, {
            user: userID,
            guild: guildID,
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

        let newMoneyAmount = parseInt(client.balance.get(key).money) - parseInt(moneyAmount);

        client.usersdata.ensure(userID, client.config.default.user_settings);
        client.usersdata.math(userID, "-", Math.floor(moneyAmount), "profile.money");

        client.balance.set(key, newMoneyAmount, 'money');

        return client.balance.get(key);
    };

    const pay = async (fromUserID, toUserID, payAmountRaw, guildID, i18n, message) => {
        
        client.balance.ensure(`${guildID}-${fromUserID}`, {
            user: fromUserID,
            guild: guildID,
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

        client.balance.ensure(`${guildID}-${toUserID}`, {
            user: toUserID,
            guild: guildID,
            money: 0,
            stats: {
                dailies: 0,
                lastTimeDaily: null,
                monthlies: 0,
                lastTimeMonthly: null,
                works: 0,
                lastTimeWorked: null,
                votes: 0,
                betTimeout: null
            }
        });

        const fromUser = client.balance.get(`${guildID}-${fromUserID}`);
        const toUser = client.balance.get(`${guildID}-${toUserID}`);

        let payAmount = parseInt(payAmountRaw);

        if(fromUser.money > payAmount) {
            removeMoney(guildID, fromUserID, payAmount);
            addMoney(guildID, toUserID, payAmount);

            message.channel.send(message.author, 
            client.embed(`<:coin:813944477248126986> | ` + i18n.__mf("command.pay.responses.paid", {
                amount: payAmount,
                toUserID: toUserID
            })))

        } else {
            let x = fromUser.money - payAmount;
            return message.channel.send(message.author, client.embed(i18n.__mf("command.pay.errors.userdoesnthavemoney", {
                neededAmount: x.toString().replace('-', ''),
            })))
        }
    };

    const checkForDaily = async (guildID, userID, i18n, message) => {

        const ms = require('parse-ms');
        const key = `${guildID}-${userID}`;

        client.balance.ensure(key, {
            user: userID,
            guild: guildID,
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

        let timeout = 72000000;
        let amount;

        if(client.settings.get(guildID).custom_configs.levels === true) {
            let points = client.points.get(key);
            let lvl = points.level;
            amount = Math.floor(randomAmount(70, 200) * (lvl/100 + 1));
        } else {
            amount = randomAmount(70, 200);
        };

        let daily = await client.balance.get(key).stats.lastTimeDaily;

        if(daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily));

            message.channel.send(message.author, client.embed(`:alarm_clock: | ` + i18n.__mf("command.daily.errors.timeLeft", {
                hours: time.hours,
                minutes: time.minutes,
                seconds: time.seconds
            })));

        } else {

            client.economy.addMoney(guildID, userID, amount);

            client.balance.set(key, Date.now(), 'stats.lastTimeDaily');
            client.balance.inc(key, 'stats.dailies');

            message.channel.send(message.author, client.embed(`<:coin:813944477248126986> | ` + i18n.__mf("command.daily.responses.collected", {
                amount: amount,
            })))

        }
    };

    const checkForMonthly = async (guildID, userID, i18n, message) => {

        const ms = require('parse-ms');
        const key = `${guildID}-${userID}`;

        client.balance.ensure(key, {
            user: userID,
            guild: guildID,
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

        let timeout = 2592000000;
        let amount;


        if(client.settings.get(guildID).custom_configs.levels === true) {
            let points = client.points.get(key);
            let lvl = points.level;
            amount = Math.floor(randomAmount(600, 978) * (lvl/100 + 1));
        } else {
            amount = randomAmount(600, 976);
        }

        let lastTimeMonthly = await client.balance.get(key).stats.lastTimeMonthly;

        if(lastTimeMonthly !== null && timeout - (Date.now() - lastTimeMonthly) > 0) {
            let time = ms(timeout - (Date.now() - lastTimeMonthly));

            message.channel.send(message.author, client.embed(`:alarm_clock: | ` + i18n.__mf("command.salary.errors.timeLeft", {
                days: time.days,
                hours: time.hours,
                minutes: time.minutes,
                seconds: time.seconds
            })));

        } else {

            client.economy.addMoney(guildID, userID, amount);

            client.balance.set(key, Date.now(), 'stats.lastTimeMonthly');
            client.balance.inc(key, 'stats.monthlies');

            message.channel.send(message.author, client.embed(`<:coin:813944477248126986> | ` + i18n.__mf("command.salary.responses.collected", {
                amount: amount,
            })))

        }
    };

    const work = async (guildID, userID, i18n, message) => {

        const ms = require('parse-ms');
        const key = `${guildID}-${userID}`;

        client.balance.ensure(key, {
            user: userID,
            guild: guildID,
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

        let timeout = 21600000;
        let amount = randomAmount(50, 198);

        let work = await client.balance.get(key).stats.lastTimeWorked;

        if(work !== null && timeout - (Date.now() - work) > 0) {
            let time = ms(timeout - (Date.now() - work));

            message.channel.send(message.author, client.embed(`:alarm_clock: | ` + i18n.__mf("command.work.errors.timeLeft", {
                hours: time.hours,
                minutes: time.minutes,
                seconds: time.seconds
            })));

        } else {

            client.economy.addMoney(guildID, userID, amount);

            client.balance.set(key, Date.now(), 'stats.lastTimeWorked');
            client.balance.inc(key, 'stats.works');

            message.channel.send(message.author, client.embed(`<:coin:813944477248126986> | ` + i18n.__mf("command.work.responses.collected", {
                amount: amount,
            })))

        }
    };

    const bal = async (guildID, userID, i18n, message) => {

        const key = `${guildID}-${userID}`;

        client.balance.ensure(key, {
            user: userID,
            guild: guildID,
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

        client.usersdata.ensure(userID, client.config.default.user_settings);

        let userData = client.balance.get(key);
        
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(':bank: | ' + i18n.__mf("command.bal.responses.description", {userID: userID, amount: userData.money, global: client.usersdata.get(userID).profile.money}))
        message.channel.send(Embed)
    };

    //////////////////////////////////////////////////
    //       ______                       _         //
    //      |  ____|                     | |        //
    //      | |__  __  ___ __   ___  _ __| |_       //
    //      |  __| \ \/ / '_ \ / _ \| '__| __|      //
    //      | |____ >  <| |_) | (_) | |  | |_       //
    //      |______/_/\_\ .__/ \___/|_|   \__|      //
    //                 | |                          //
    //                 |_|                          //                         
    //////////////////////////////////////////////////

    client.economy = {
        get: get,
        setMoney: setMoney,
        addMoney: addMoney,
        removeMoney: removeMoney,
        pay: pay,
        checkForDaily: checkForDaily,
        checkForMonthly: checkForMonthly,
        work: work,
        bal: bal,
    };
    
}