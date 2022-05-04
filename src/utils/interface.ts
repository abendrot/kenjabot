import { Message } from 'discord.js';

export interface ICommand {
    name: string;
    description: string;
    aliases: string[];
    syntax: string;
    execute(message: Message, args: string[]): any;
}