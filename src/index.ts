import Discord from "discord.js";
import * as dotenv from "dotenv";
import glob from "glob";
import { promisify } from "util";
import { ICommand } from "./utils/interface";

dotenv.config();

const prefix = "j!";

const client: Discord.Client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const commands: Array<ICommand> = [];
const globPromise = promisify(glob);

(async () => {
  const commandFiles = await globPromise(`${__dirname}/commands/**/*.{js,ts}`);

  for (const file of commandFiles) {
    const command = await import(file);
    commands.push(command);
    console.log(`Command ${command.name} loaded successfully.`);
  }
})();

client.on("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
  console.log(`Currently in ${client.guilds.cache.size} servers.`);
});

client.on("messageCreate", async (message: Discord.Message) => {
  if (
    !message.content.toLowerCase().startsWith(prefix) ||
    message.author.bot ||
    message.guild === null
  ) {
    return;
  }

  if (!message.member) {
    return;
  }

  // parse the message for the command
  const [commandName, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  console.log(`Potential command name: ${commandName}`);
  console.log(`Potential arugments: ${args}`);

  const command = commands.find(
    (c) =>
      c.name === commandName ||
      (c.aliases ? c.aliases!.includes(commandName) : false)
  );

  // if the command is found, execute it
  if (command) {
    command.execute(message, args);
  } else {
    console.log("No command found, ignoring message.");
  }
});

(async () => {
  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (error) {
    console.log("Failed to log in as Discord bot. Below is the error:");
    console.log(error);
  }
})();