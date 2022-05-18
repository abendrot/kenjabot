import { Message } from "discord.js";
import { ICommand } from "../utils/interface";
import get from "axios";

const command: ICommand = {
    name: "define",
    description: "Defines the given word.",
    aliases: ["d"],
    syntax: "j!define [word]",
    async execute(message: Message<boolean>, args?: string[]) {
        console.log(`Command define started by user ${message.member!.user.tag} 
                        in ${message.guild!.name}.`);

        if (args?.length != 1) {
            try {
                console.log("Incorrect number of arguments supplied. Stopping execution.");
                await message.channel.send(`Invalid syntax! Correct syntax: ${this.syntax}`);
                return;
            } catch (e) {
                console.log(`Failed to send a message in ${message.guild!.name}. \
                                The error message is below:`);
                console.log(e);
            }
        }

        const word = args?.shift(); // get the word to define

        if (!word) {
            try {
                console.log(`Invalid word provided. Stopping execution.`);
                await message.channel.send(`Invalid word!`);
                return;
            } catch (e) {
                console.log(`Failed to send a message in ${message.guild!.name}. 
                                The error message is below:`);
                console.log(e);
            }
        }

        let res;

        try {
            res = await get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const definition =
                res.data[0]["meanings"][0]["definitions"][0]["definition"]; // get the definition

            try {
                await message.channel.send(`Definition: ${definition}`);
                console.log(`Command define, started by user ${message.member!.user.tag} 
                                terminated successfully in guild ${message.guild!.name}.`);
            } catch (e) {
                console.log(`Failed to send a message in ${message.guild!.name}. 
                                The error message is below:`);
                console.log(e);
            }
        
        } catch (e) {
            console.log(e);
            try {
                console.log(`Failed to get a definition for word ${word}. 
                                The error message is below:`);
                await message.channel.send(`Failed to get a definition for that word.`);
                return;
            } catch (e) {
                console.log(`Failed to send a message in ${message.guild!.name}. 
                                The error message is below:`);
                console.log(e);
            }
        }
    },
};

export = command;