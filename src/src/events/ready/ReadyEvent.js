const BaseEvent = require("../../utils/structures/BaseEvent");
const Discord = require("discord.js");
const mongoose = require("mongoose");

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  /**
   *
   * @param {Discord.Client} client
   */
  async run(client) {
    console.log(client.user.tag + " has logged in.");
    mongoose.connect("mongodb://localhost:27017/guildsJoin");
    client.config = {
      port: 5555,
      serverID: "861075863117103134",
      secret: "tIuWoJK1RZauO0fQT8CxqBcaMDWLDFsI",
      redirect_url: "http://localhost:5555/api/auth/discord/redirect",
    };
    require("../../../API/server")(client);
  }
};
