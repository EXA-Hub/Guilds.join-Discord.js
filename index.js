// try {
//     const Discord = require('discord.js');
//     const db = require("quick.db");
//     const { prefix, owners } = require('./config');
//     const config = require('./config');
//     const refreshToken = require('./functions/refreshToken');
//     require('dotenv').config();
//     require('./server');

//     const client = new Discord.Client();

//     client.on('ready', () => {
//         console.log(client.user.username + ' is ready!');
//     });

//     client.on("message", message => {
//         if (message.author.bot || !message.guild) return;
//         if (!message.content.startsWith(prefix)) return;
//         if (owners.includes(message.author.id)) {
//             const args = message.content.trim().split(/ +/g);
//             const cmd = args[0].slice(prefix.length).toLowerCase();
//             const guild = client.guilds.cache.get(args[1]) || message.guild;
//             const user = client.users.cache.get(args[1]);
//             switch (cmd) {
//                 case 'autoJoin':
//                     db.set('autoJoin', guild.id);
//                     message.reply(`السيرفر الإفتراضي الأن هو ${guild.name}`);
//                     break;
//                 case 'join':
//                     const addMember = require('./functions/addMember');
//                     if (user) {
//                         const accessToken = db.get(`${user.id}.refresh_token`);
//                         if (!accessToken) return message.reply('لا يمكنني إدخال العضو');
//                         refreshToken(config.discord.client.id || config.discord.bot.id, config.discord.client.secret, accessToken, news => {
//                             db.set(user.id, news);
//                             addMember(guild, user, news.access_token);
//                         });
//                         message.reply('تم إدخال العضو');
//                     } else {
//                         const num = Math.floor(Number(args[1]));
//                         if (Number.isNaN(num)) return message.reply('أدخل رقم صحيح');
//                         const users = db.get('Users');
//                         if (!users || num > users.length) return message.reply('هذا العدد كبير للغاية');
//                         const selected = require('./functions/getRandom')(users, num);
//                         let done = 0;
//                         let notdone = 0;
//                         let all = 0;
//                         selected.forEach(id => {
//                             try {
//                                 const nowUser = client.users.cache.get(id);
//                                 const token = db.get(`${id}.refresh_token`);
//                                 refreshToken(config.discord.client.id || config.discord.bot.id, config.discord.client.secret, token, news => {
//                                     addMember(guild, nowUser, news.access_token);
//                                     db.set(id, news);
//                                     ++done
//                                 });
//                             } catch (error) {
//                                 ++notdone
//                             } finally {
//                                 ++all
//                             }
//                         });
//                         message.reply(`نجح ${done}\nفشل ${notdone}\nالمجموع ${all}`);
//                     }
//                     break;
//                 default:
//                     message.reply('👀 | هذا الأمر غير متاح');
//                     break;
//             }
//         } else return;
//     });

//     client.login(config.discord.bot.token);
// } catch (error) {
//     throw error;
// }