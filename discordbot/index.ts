import { Client, GatewayIntentBits, ActivityType, type TextChannel, EmbedBuilder, Colors, Options } from "discord.js";
import { config } from "dotenv";
import { loadParams } from "./url.ts";
import { registerCleanMessage } from "./clean.ts";
import { registerCommands } from "./commands.ts";

config();

const client = new Client({
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        MessageManager: 0,
        ReactionManager: 0,
    }),
})

client.on("clientReady", async () => {
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
    
    const readyChannelId = "1575470427034357811";
    const readyChannel = (await client.channels.fetch(readyChannelId)) as TextChannel;
    if (readyChannel) {
        await readyChannel.send({
            embeds: [
                new EmbedBuilder({
                    title: "CleanURLが起動しました！",
                    description: `サーバー数: ${client.guilds.cache.size}鯖`,
                    color: Colors.Green
                })
            ]
        })
    }
})

client.login(process.env.DISCORD_TOKEN)

process.on('unhandledRejection', (reason, promise) => {
  console.error('未処理の Promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('未捕捉の例外:', error);
});
