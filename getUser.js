const axios = require('axios');


async function getUser(access_token, user) {
    // getting user information
    const responseUser = await axios.get('https://discord.com/api/v8/users/@me', {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    user(responseUser.data);
}

module.exports = getUser;