import { Message, Role } from "discord.js";
import { getUserFromMention } from "../utils/helpers";
import { ICommand } from "../utils/interface";

const command: ICommand = {
  name: "bestow",
  description: "",
  aliases: ["role"],
  syntax: ".bestow [role name] [user mention]",
  async execute(message: Message<boolean>, args?: string[]) {
    console.log(`Command bestow started by user ${message.member!.user.tag} in ${message.guild!.name}.`);
      if (args?.length != 2) {
      try {
        console.log("Incorrect number of arguments supplied. Stopping execution.");
        await message.channel.send(
          `Invalid syntax! Correct syntax: ${this.syntax}`
        );
        return;
      } catch (e) {
        console.log(`Failed to send a message in ${message.guild!.name}. The error message is below:`);
        console.log(e);
      }
    }
    
    const roleName = args?.shift(); //get role name
    const roleCache = message.guild?.roles.cache;
    const role = roleCache?.find((r) => r.name === roleName);

    if (!role) {
        try { // check if number of args is correct
          console.log("Role already exists in this server. Stopping execution.");
          await message.channel.send(`Role already exists on this server.`);
          return;
        } catch (e) {
          console.log(`Failed to send a message in ${message.guild!.name}. The error message is below:`);
          console.log(e);
        }
    }

    const userMention = args?.shift();
    const user = getUserFromMention(message, userMention!);

    if (!user) {
        try {
          console.log("User doesn't exist in this server. Stopping execution.");
          await message.channel.send(`Invalid user.`);
          return;
        } catch (e) {
          console.log(`Failed to send a message in ${message.guild!.name}. The error message is below:`);
          console.log(e);
        }
    }

    let newRole: Role | undefined;

    try {
        console.log(`Role ${role!.name} created successfully in guild ${message.guild}`);
        newRole = await message.guild?.roles.create({
            name: roleName
        });
    } catch (e) {
        console.log(`Failed to create role in ${message.guild!.name}. The error message is below:`);
        console.log(e);
    }

    if (newRole) {
        try {
          await user?.roles.add(newRole); // try to add the role to the user
          console.log(`Role ${newRole.name} successfully bestowed to member ${user?.user.tag} 
                            in guild ${message.guild}.`);
          console.log(`Command bestow, started by user ${message.member!.user.tag} 
                            terminated successfully in guild ${message.guild!.name}.`);
        } catch (e) {
          console.log(`Failed to add a role in ${message.guild!.name}. The error message is below:`);
          console.log(e);
        }
    } else {
        try {
          console.log("Role could not be created successfully. Stopping execution.");
          await message.channel.send(`Role could not be created successfully`);
          return;
        } catch (e) {
          console.log(`Failed to send a message in ${message.guild!.name}. The error message is below:`);
          console.log(e);
        }
      }
  },
};

export = command;