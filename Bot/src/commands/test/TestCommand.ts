import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class TestCommand extends BaseCommand {
  constructor() {
    super("test", "testing", []);
  }

  async run(_client: DiscordClient, message: Message, _args: Array<string>) {
    message.channel.send(_client.user?.username + " works");
  }
}
