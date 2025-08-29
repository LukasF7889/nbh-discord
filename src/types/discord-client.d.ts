import type { Client, Collection } from "discord.js";
import type { Command } from "./command";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}
