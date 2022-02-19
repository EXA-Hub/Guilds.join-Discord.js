const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class AddMemberCommand extends BaseCommand {
  constructor() {
    super("addMember", "Members", []);
  }
  /**
   *
   * @param {Discord.Client} client
   * @param {Discord.Message} message
   * @param {Array<String>} args
   */
  run(client, message, args) {
    const DiscordOauth2 = require("discord-oauth2");
    const Users = require("../../../data/mongo");
    const oauth = new DiscordOauth2();
    (async () => {
      if (!args[0]) {
        const IDs = await Users.find();
        message.channel.send("الأعضاء\n" + IDs.map((ID) => `${ID.userId}\n`));
      } else if (args[0] === "all") {
        const users = await Users.find();
        users.forEach(async (user) => {
          if (user) {
            message.channel.send("إضافة العضو ✅\n" + user.toString());
            if (user.accessToken) {
              oauth.addMember({
                accessToken: user.accessToken,
                guildId: message.guildId,
                botToken: client.token,
                userId: user.userId,
                nickname: user.nick,
                deaf: user.deaf ? true : false,
                mute: user.mute ? true : false,
                roles: user.roles.map(
                  (role) =>
                    message.guild.roles.cache.find((r) => r.name === role).id
                ),
              });
            } else message.channel.send("خطأ ×");
          } else message.channel.send("خطأ ××");
        });
      } else {
        Users.findOne({ userID: args[0] }, (err, user) => {
          if (user && !err) {
            message.channel.send("إضافة العضو ✅\n" + user.toString());
            if (user.accessToken) {
              oauth.addMember({
                accessToken: user.accessToken,
                guildId: message.guildId,
                botToken: client.token,
                userId: user.userId,
                nickname: user.nick,
                deaf: user.deaf ? true : false,
                mute: user.mute ? true : false,
                roles: user.roles.map(
                  (role) =>
                    message.guild.roles.cache.find((r) => r.name === role).id
                ),
              });
            } else message.channel.send("خطأ ×");
          } else message.channel.send("خطأ ××");
        });
      }
    })();
  }
};
