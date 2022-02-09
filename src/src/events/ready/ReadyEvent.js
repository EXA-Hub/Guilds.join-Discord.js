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
    mongoose.connect(client.config.mongoUri, {});
    require("../../../backup/index")(client);
    require("../../../API/server")(client);
  }
};
