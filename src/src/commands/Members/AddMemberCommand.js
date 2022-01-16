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
    const Users = require("../../../data/mongo");
    (async () => {
      if (!args[0]) {
        const IDs = await Users.find();
        message.channel.send("Members\n" + IDs.map((ID) => `${ID.userId}\n`));
      } else {
        const userID = args[0];
        const user = await Users.findOne({ userId: userID });
        if (user) {
          message.channel.send("Member Added ✅\n" + user.toString());
          if (user.accessToken) {
            const userDataJS = client.users.cache.get(user.userID);
            if (userDataJS) {
              const guild = client.guilds.cache.get(client.config.serverID);
              guild.members.add(userDataJS, { accessToken: user.accessToken });
            } else message.channel.send("error");
          } else message.channel.send("error");
        } else message.channel.send("error");
      }
    })();
  }
};
