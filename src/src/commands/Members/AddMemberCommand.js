const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

const example = {
  _id: { $oid: "62110998316c4adaf254a0db" },
  userId: "635933198035058700",
  __v: 0,
  accessToken: "XXif4HdLbw45x3Jri67WFvhJvCkx04",
  deaf: false,
  discordTag: "ZAMPX#0063",
  email: "vip.mimo2015@gmail.com",
  mute: false,
  nick: null,
  refreshToken: "FHlAk7gedHkrpuALtVnLjpdYkU2pGZ",
  roles: ["test role", "new role"],
};

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
