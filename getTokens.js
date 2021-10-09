const axios = require('axios');
const url = require('url');


async function getTokens(client_id, client_secret, code, redirect_url, tokens) {
    // Getting asess token and refresh token
    const formData = new url.URLSearchParams({
        client_id: client_id,
        client_secret: client_secret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_url,
    });
    const response = await axios.post(
        'https://discord.com/api/v8/oauth2/token',
        formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );
    tokens(response.data);
}

module.exports = getTokens;