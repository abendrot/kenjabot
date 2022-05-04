import { Message } from "discord.js";
import { ICommand } from "../utils/interface";

const command: ICommand = {
    name: "summon",
    description: "",
    aliases: ["invoke"],
    syntax: ".summon",
    async execute(message: Message, _args: string[]) {
        console.log(`Command summon started by user ${message.member!.user.tag} 
        in ${message.guild!.name}.`);
        try {
            await message.channel.send("The great me hath been summoned.");
            console.log(`Command summon started by user ${message.guild!.name} terminated succesfully in ${message.guild!.name}.`);
        } catch (e) {
            console.log(`Failed to send a message in ${message.guild!.name}. The error message is below:`);
            console.log(e);
        }
    }
};

export = command;