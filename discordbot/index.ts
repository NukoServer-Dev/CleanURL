import { Client, GatewayIntentBits, Events, ActivityType } from "discord.js";
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

    setInterval(() => {
        client.user?.setActivity({
            type: ActivityType.Custom,
            name: "URLを視聴中"
        })
    }, 10000)
})

client.login(process.env.DISCORD_TOKEN)