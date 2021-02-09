const { ShardingManager } = require('discord.js');
require('dotenv').config();
const moment = require("moment"); require("moment-duration-format");
const actualTime = moment(Date.now()).format('DD/MM/YYYY@h:m');

const shardList = [];

const manager = new ShardingManager('./bot.js', {
    totalShards: 'auto',
    shardList: 'auto',
    token: process.env.BOT_TOKEN
});

manager.spawn();

manager.on('shardCreate', (shard) => {
    shard.on("ready", () => {
        console.log(`[${actualTime}][SHARD] ${shard.id} Carregada!`);
        shard.send({type: "shardId", data: {shardId: shard.id}});
        let shardID = shard.id;
        shardList.push({shardID: {data: shard}});
    });
});