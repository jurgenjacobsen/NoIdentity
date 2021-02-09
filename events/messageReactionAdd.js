module.exports = async (client, reaction, user) => {

    if(user.bot) return;

    if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Algo aconteceu ao logar a mensagem: ', error);
			return;
		}
	}

};