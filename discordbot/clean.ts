import {
  ChannelType,
  Colors,
  EmbedBuilder,
  type Client,
  type Message,
} from "discord.js";
import { countParams, paramData, reloadParams } from "./url";
import { exec } from "child_process";

type ParamRule = {
  type?: "black" | "white";
  items: string[];
};

function filterParams(params: URLSearchParams, rule: ParamRule): void {
  if (rule.type === "white") {
    for (const key of [...params.keys()]) {
      if (!rule.items.includes(key)) {
        params.delete(key);
      }
    }
  } else {
    for (const item of rule.items) {
      params.delete(item);
    }
  }
}

async function sendCleanedMessage(
  message: Message,
  content: string,
): Promise<void> {
  const webhooks = await message.channel.fetchWebhooks();
  let webhook = webhooks.find((wh) => wh.name === "CleanURL");

  if (!webhook) {
    webhook = await message.channel.createWebhook({
      name: "CleanURL",
    });

    await message.channel.send({
      embeds: [
        new EmbedBuilder({
          title: "必要なWebhookが作成されました。",
          description: "このWebhookはチャンネルごとに作成されます。",
          color: Colors.Green,
          footer: {
            text: "ぬこぬこサーバー",
          },
        }),
      ],
    });
  }

  await webhook.send({
    content,
    username: message.author.displayName,
    avatarURL: message.author.displayAvatarURL(),
    allowedMentions: { parse: [] },
  });

  await message.delete();
}

export async function registerCleanMessage(client: Client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (
      message.channel.type !== ChannelType.GuildText &&
      message.channel.type !== ChannelType.GuildAnnouncement &&
      message.channel.type !== ChannelType.GuildVoice &&
      message.channel.type !== ChannelType.GuildStageVoice &&
      message.channel.type !== ChannelType.PublicThread &&
      message.channel.type !== ChannelType.PrivateThread
    ) {
      return;
    }

    try {
      if (process.env.DISCORD_OWNER_ID === message.author.id) {
        if (message.content.startsWith("cu!")) {
          const cmdName = message.content.split("cu!")[1];
          if (cmdName === "param") {
            await reloadParams();
            await message.reply("パラメータデータをアップデートしました。");
            return;
          } else if (cmdName === "count") {
            const countParam = countParams();
            await message.reply(`パラメータデータ: ${countParam}個`);
            return;
          } else if (cmdName === "pull") {
            exec("git pull", (error, stdout, stderr) => {
              if (error) {
                console.error(error);
                message.reply("アップデートに失敗しました。");
                return;
              }
              message.reply("アップデートしました。");
            });
            return;
          }
        }
      }

      const urls = message.content.match(/https?:\/\/[^\s]+/g);
      if (!urls) return;

      let messageContent = message.content;

      for (const url of urls) {
        let urlobj: URL;
        try {
          urlobj = new URL(url);
        } catch {
          continue;
        }

        const params = new URLSearchParams(urlobj.searchParams);
        const hostParam = paramData.get(urlobj.hostname) as
          ParamRule | undefined;

        if (hostParam) {
          filterParams(params, hostParam);
        } else {
          const more = paramData.get("more") as ParamRule | undefined;
          if (!more) {
            console.log("パラメータデータが読み込まれていません。");
            return;
          }
          filterParams(params, more);
        }

        urlobj.search = params.toString();
        messageContent = messageContent.replaceAll(url, urlobj.toString());
      }

      if (messageContent !== message.content) {
        await sendCleanedMessage(message, messageContent);
      }
    } catch (e) {
      console.error(e);
    }
  });
}
