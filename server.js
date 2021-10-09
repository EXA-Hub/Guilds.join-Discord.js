const refreshToken = require('./functions/refreshToken');
const getTokens = require('./functions/getTokens');
const saveData = require('./functions/saveData');
const getUser = require('./functions/getUser');
const express = require('express');
const config = require('./config');
require('dotenv').config();
const app = express();


const port = config.web.port ||
    process.env.PORT;
const client_secret = '' ||
    config.discord.client.secret ||
    process.env.CLIENT_SECRET;
const redirect_url = `http://localhost:${port}/discord` ||
    config.web.port ||
    process.env.REDIRECT_URL;
const client_id = '' ||
    config.discord.client.id ||
    config.discord.bot.id ||
    process.env.CLIENT_ID;

// if you are not using a port
app.listen(() => console.log('Server started'));
// if you will run it in your pc
app.listen(port, () => console.log(`listening to http://localhost:${port}`));

app.get('/', async function(req, res) {
    res.send('Made By: ZAMPX#0063' + 'https://discord.gg/ZPpwb3GRyG');
});

app.get('/discord', async function(req, res) {
    if (!req.query.code) return res.json({ error: 'code is required' });
    getTokens(client_id, client_secret, req.query.code, redirect_url, tokens => {
        getUser(tokens.access_token, user => {
            saveData(user, tokens);
            res.json(user);
        });
    });
});

app.get('/refresh', async function(req, res) {
    if (!req.query.refresh_token) return
    res.json({ error: 'refresh_token is required' });
    const refresh_token = req.query.refresh_token;
    refreshToken(client_id, client_secret, refresh_token, newTokens => {
        getUser(newTokens.access_token, user => {
            saveData(user, newTokens);
            res.json(newTokens);
        });
    });
});