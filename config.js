require('dotenv').config();
module.exports = {
    prefix: '$',
    discord: {
        bot: {
            token: '' || process.env.BOT_TOKEN,
            id: '896160413417353287' || process.env.CLIENT_ID
        },
        client: {
            secret: '' || process.env.CLIENT_SECRET,
            id: '' || process.env.CLIENT_ID
        }
    },
    web: {
        url: '' || process.env.WEB_URL || process.env.REDIRECT_URL.replace('/discord', ''),
        api: {
            redirect: {
                code: 'discord',
                url: '' || process.env.REDIRECT_URL || process.env.WEB_URL + `/discord`
            }
        },
        port: '' || process.env.PORT
    },
    test: {
        servers: {
            ids: ['719288987700953150', 'أيدي سيرفرك هنا']
        }
    },
    owners: ['635933198035058700', 'أيديك هنا']
}