const { Client, Intents } = require("discord.js");
const { registerCommands, registerEvents } = require("./utils/registry");
const config = require("../slappey.json");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  client.config = require("../../config.json");
  await client.login(client.config.token);
})();
