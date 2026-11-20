import { ChannelType, Colors, EmbedBuilder, type Client } from "discord.js";
import { countParams, paramData, reloadParams } from "./url";
import { exec } from "child_process";

export async function registerCleanMessage(client: Client) {
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;

        if (!message.guild) return;
        if (
            message.channel.type != ChannelType.GuildText &&
            message.channel.type != ChannelType.GuildAnnouncement
        ) return;

        try {
            if (process.env.DISCORD_OWNER_ID == message.author.id) {
                if (message.content.startsWith("cu!")) {
                    const cmdName = message.content.split("cu!")[1];
                    if (cmdName == "param") {
                        await reloadParams();
                        await message.reply("パラメータデータをアップデートしました。")
                        return;
                    } else if (cmdName == "count") {
                        const countParam = countParams();
                        await message.reply(`パラメータデータ: ${countParam}個`)
                    } else if (cmdName == "pull") {
                        exec('git pull', (error, stdout, stderr) => {
                            message.reply("アップデートしました。")
                        });
                    }
                }
            }

            const urls = message.content.match(/https?:\/\/[^\s]+/g);
            if (!urls) return;

            let messageContent = message.content;

            for (const url of urls) {
                let urlobj = new URL(url)
                let params = new URLSearchParams(urlobj.searchParams)

                const hostParam = paramData.get(urlobj.hostname);
                if (hostParam) {
                    for (const hostp of hostParam) {
                        params.delete(hostp)
                    }
                } else {
                    const more = paramData.get('more');
                    if (!more) {
                        console.log("パラメータデータが読み込まれていません。")
                        return
                    };
                    for (const morep of more) {
                        params.delete(morep)
                    }
                }

                urlobj.search = params.toString();

                messageContent = messageContent.replaceAll(url, urlobj.toString())
            }

            if (messageContent !== message.content) {
                const webhooks = await message.channel.fetchWebhooks();
                for (const webhook of webhooks.values()) {
                    if (webhook.name == "CleanURL") {
                        await webhook.send({
                            content: messageContent,
                            username: message.author.displayName,
                            avatarURL: message.author.displayAvatarURL(),
                            allowedMentions: { parse: [] }
                        })
                        await message.delete();
                        return;
                    }
                }
                const webhook = await message.channel.createWebhook({
                    name: "CleanURL"
                })

                await message.channel.send({
                    embeds: [new EmbedBuilder({
                        title: "必要なWebhookが作成されました。",
                        description: "このWebhookはチャンネルごとに作成されます。",
                        color: Colors.Green,
                        footer: {
                            text: "ぬこぬこサーバー"
                        }
                    })]
                })

                await webhook.send({
                    content: messageContent,
                    username: message.author.displayName,
                    avatarURL: message.author.displayAvatarURL(),
                    allowedMentions: { parse: [] }
                })
                await message.delete();
            }
        } catch (e) {
            console.error(e);
        }
    })
}