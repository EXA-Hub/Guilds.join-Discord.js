const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super("test", "testing", []);
  }
  /**
   *
   * @param {Discord.Client} client
   * @param {Discord.Message} message
   * @param {Array<String>} args
   */
  async run(client, message, args) {
    message.channel.send(client.user.username + " works");
  }
};
