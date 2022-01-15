import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class AddMemberCommand extends BaseCommand {
  constructor() {
    super("addMember", "Members", []);
  }

  async run(_client: DiscordClient, message: Message, _args: Array<string>) {
    message.channel.send("addMember command works");
  }
}
