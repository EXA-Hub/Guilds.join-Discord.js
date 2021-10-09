const axios = require('axios');
const url = require('url');


async function refreshToken(client_id, client_secret, refresh_token, newTokens) {
    // refreshing token
    const reformData = new url.URLSearchParams({
        client_id: client_id,
        client_secret: client_secret,
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
    });
    const reresponse = await axios.post(
        'https://discord.com/api/v8/oauth2/token',
        reformData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );
    newTokens(reresponse.data);
}

module.exports = refreshToken;