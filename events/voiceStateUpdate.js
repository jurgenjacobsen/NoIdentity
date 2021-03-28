module.exports = async (client, oldMember, newMember) => {

    if (client.users.cache.get(newMember.id).bot || client.users.cache.get(oldMember.id).bot) return;

    function counter() {
        client.stats.inc(newMember.guild.id, 'minutes_spoke');
    };
    
    let startCounter;

    if (!oldMember.channelID && newMember.channelID) {
        startCounter = setInterval(() => {
            counter();
        }, 120000);
    };

    if (oldMember.channelID && !newMember.channelID) {
        clearInterval(startCounter);
    };

}