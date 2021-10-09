function addMember(guild, user, accessToken) {
    // // if you are using discord.js v13
    // guild.members.add(user, {
    //     accessToken: accessToken,
    //     nick: user.username,
    //     roles: [null],
    //     mute: false,
    //     deaf: false,
    //     force: false,
    //     fetchWhenExisting: true
    // });

    // if you are using discord.js v12
    guild.addMember(user, {
        accessToken: accessToken,
        // nick: user.username,
        // roles: [null],
        // mute: false,
        // deaf: false,
    });
}

module.exports = addMember;