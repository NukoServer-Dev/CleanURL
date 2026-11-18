import { Client, GatewayIntentBits, Events } from "discord.js";
import { config } from "dotenv";
import { loadParams } from "./url.ts";
import { registerCleanMessage } from "./clean.ts";
import { registerCommands } from "./commands.ts";

config();

const client = new Client({
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]
})

client.on("clientReady", () => {
    loadParams();

    registerCleanMessage(client);
    registerCommands(client);

    console.log("起動しました。")
})

client.login(process.env.DISCORD_TOKEN)