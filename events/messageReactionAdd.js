const Discord = require('discord.js');
const i18n = require('i18n');

module.exports = async (client, reaction, user) => {

	try {
		
		if(user.bot) return;

		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (error) {
				console.error('Algo aconteceu ao logar a mensagem: ', error);
				return;
			}
		}
	
		if(!reaction.message) return;
		if(!user) return;

		if(reaction.message.guild) {
	
			const settings = client.settings.get(reaction.message.guild.id).custom_configs;
	
			if(settings.toDoChannelID === reaction.message.channel.id) {
				if(reaction.message.guild.channels.cache.get(settings.toDoChannelID)) {
					if(reaction.message.author.id === client.user.id) {
						if(reaction.message.embeds) {
	
							let rawLang = settings.lang;
	
							if(client.languages.includes(rawLang)) {
								i18n.setLocale(rawLang);
							} else {
								i18n.setLocale('pt_br');
							}
	
							let oldEmbed = reaction.message.embeds[0];
	
							let Embed = new Discord.MessageEmbed()
							.setDescription(reaction.message.embeds[0].description)
							.setAuthor(user.tag, user.displayAvatarURL());
	
							let authorID = oldEmbed.author.iconURL
							.replace('https://cdn.discordapp.com/avatars/', '')
							.slice(0, 18);
	
							if(authorID === user.id) {
								if(reaction._emoji.id === '813506789323964476') {
									Embed.setColor("#8855ff");
									Embed.setFooter(`Status: ${i18n.__("modules.functions.toDo.statusFinalized")}`);
									reaction.message.reactions.removeAll();
									reaction.message.edit(Embed);
								} else if(reaction._emoji.id === '813506789064048701'){
									Embed.setColor("#cf3838");
									Embed.setFooter(`Status: ${i18n.__("modules.functions.toDo.statusCancelled")}!`);
									reaction.message.reactions.removeAll();
									reaction.message.edit(Embed);
								} else {
									reaction.users.remove(user).catch(console.error);
								}
							} else {
								reaction.users.remove(user).catch(console.error);
							}
						}
					}
				}
			} else if(settings.suggestionChannelID === reaction.message.channel.id) {
				let minimumVotes = settings.minimumSuggestionVotesToApprove;
				
				let upvoteEmojiID = reaction.message.guild.emojis.cache.get(settings.custom_upvotes_emojiID) ? settings.custom_upvotes_emojiID : "785248178752585750";
				let downvoteEmojiID = reaction.message.guild.emojis.cache.get(settings.custom_downvote_emojiID) ? settings.custom_downvote_emojiID : "785248178836340747";
				let approveEmojiID = reaction.message.guild.emojis.cache.get(settings.custom_approved_emojiID) ? settings.custom_approved_emojiID : "785248179301384212";
	
				if(reaction.message.guild.channels.cache.get(settings.suggestionChannelID)) {
					if(reaction.message.author.id === client.user.id) {
						if(reaction.message.embeds) {
							if(reaction._emoji.id === approveEmojiID) { // Aprovado
								if(user.id === reaction.message.guild.owner.id) {
			
									reaction.message.reactions.cache.get(approveEmojiID).remove();
	
									let Embed = new Discord.MessageEmbed()
									.setAuthor(reaction.message.embeds[0].author.name, reaction.message.embeds[0].author.iconURL)
									.setColor(client.config.color)
									.setDescription(reaction.message.embeds[0].description);
	
									reaction.message.edit(`${i18n.__mf("modules.functions.suggestion.approvedByAdm", {
										admID: user.id
									})}`, Embed);
			
								} else {
									reaction.users.remove(user).catch(console.error);
								};
							} else if(reaction._emoji.id === upvoteEmojiID) { // Upvote
			
								if(reaction.count === parseInt(minimumVotes)) {
			
									let Embed = new Discord.MessageEmbed()
									.setAuthor(reaction.message.embeds[0].author.name, reaction.message.embeds[0].author.iconURL)
									.setColor(client.config.color)
									.setDescription(reaction.message.embeds[0].description);
			
									reaction.message.reactions.removeAll();
									reaction.message.edit(`${i18n.__mf("modules.functions.suggestion.approved", {totalVotes: minimumVotes})}`, Embed);
			
								}
			
							} else if(reaction._emoji.id === downvoteEmojiID) { // DownVote
								
							} else {
								reaction.users.remove(user).catch(console.error);
							}
						}
					}
				}
			}
			
		};

	} catch(err) {
		console.log(err);
	}

};