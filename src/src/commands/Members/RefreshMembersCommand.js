const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class RefreshMembersCommand extends BaseCommand {
  constructor() {
    super("refreshMembers", "Members", []);
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
    const oauth2Data = {
      clientId: client.user.id,
      clientSecret: client.config.secret,
      redirectUri: client.config.redirect_url,
    };
    const oauth = new DiscordOauth2(oauth2Data);
    (async () => {
      if (!args[0]) {
        const IDs = await Users.find();
        message.channel.send("الأعضاء\n" + IDs.map((ID) => `${ID.userId}\n`));
      } else if (args[0] === "all") {
        const users = await Users.find();
        users.forEach(async (user) => {
          if (user) {
            message.channel.send("تحديث العضو ✅\n" + user.toString());
            if (user.refreshToken) {
              oauth
                .tokenRequest({
                  scope: ["identify", "guilds", "email", "guilds.join"],
                  refreshToken: user.refreshToken,
                  grantType: "refresh_token",
                })
                .then(async (userData) => {
                  await Users.findOneAndUpdate(
                    {
                      userId: user.userId,
                    },
                    {
                      userId: user.userId,
                      discordTag: user.discordTag,
                      email: user.email,
                      nick: user.nick,
                      roles: user.roles,
                      deaf: user.deaf ? true : false,
                      mute: user.mute ? true : false,
                      accessToken: userData.access_token,
                      refreshToken: userData.refresh_token,
                    },
                    {
                      upsert: true,
                    }
                  );
                });
            } else message.channel.send("خطأ ×");
          } else message.channel.send("خطأ ××");
        });
      } else {
        Users.findOne({ userID: args[0] }, (err, user) => {
          if (user && !err) {
            message.channel.send("تحديث العضو ✅\n" + user.toString());
            if (user.refreshToken) {
              oauth
                .tokenRequest({
                  scope: ["identify", "guilds", "email", "guilds.join"],
                  refreshToken: user.refreshToken,
                  grantType: "refresh_token",
                })
                .then(async (userData) => {
                  await Users.findOneAndUpdate(
                    {
                      userId: user.userId,
                    },
                    {
                      userId: user.userId,
                      discordTag: user.discordTag,
                      email: user.email,
                      nick: user.nick,
                      roles: user.roles,
                      deaf: user.deaf ? true : false,
                      mute: user.mute ? true : false,
                      accessToken: userData.access_token,
                      refreshToken: userData.refresh_token,
                    },
                    {
                      upsert: true,
                    }
                  );
                });
            } else message.channel.send("خطأ ×");
          } else message.channel.send("خطأ ××");
        });
      }
    })();
  }
};
