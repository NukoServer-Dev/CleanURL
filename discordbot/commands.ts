import {
  Colors,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionType,
  SlashCommandBuilder,
  type Client,
} from "discord.js";

import { countParams, paramData } from "./url";

export const commandData = [
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Botの使い方を表示します"),
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Botのステータスを表示します。"),
  new SlashCommandBuilder()
    .setName("check")
    .setDescription("そのドメインが対応しているかを確認します。")
    .addStringOption((str) => str.setName("domain").setDescription("確認するドメイン").setRequired(true)),
];

export async function registerCommands(client: Client) {
  client.on("interactionCreate", async (interaction: ChatInputCommandInteraction) => {
    if (interaction.type == InteractionType.ApplicationCommand) {
      if (interaction.commandName == "help") {
        await interaction.deferReply();
        await interaction.editReply({
          embeds: [
            new EmbedBuilder({
              title: "URL Cleanerの使い方",
              color: Colors.Blue,
              description:
                "URLの不要なパラメータを\n自動で編集することができます。\n\n",
            }),
            new EmbedBuilder({
              color: Colors.Blue,
              fields: [
                {
                  name: "自動で編集してほしくないチャンネルがある",
                  value:
                    "自動で編集してほしくないチャンネルでは、\nこのBotの閲覧権限を剥奪することで\n編集できなくできます。",
                  inline: false,
                },
                {
                  name: "メンションについて",
                  value: "メンションは自動的に無効化されます。",
                  inline: false,
                },
              ],
              footer: {
                text: "ぬこぬこサーバー",
              },
            }),
          ],
        });
        return;
      }
    } else if (interaction.commandName == "status") {
      await interaction.deferReply();

      const countParam = countParams();

      await interaction.editReply({
        embeds: [
          new EmbedBuilder({
            title: "Botのステータス",
            color: Colors.Blue,
            fields: [
              {
                name: "登録パラメータ数",
                value: `${countParam}個`,
                inline: true,
              }
            ]
          }),
        },
      )
    } else if (interaction.commandName == "check") {
      await interaction.deferReply();

      const domain = interaction.options.getString("domain", true);

      const isDomain = paramData.get(domain)
      if (!isDomain) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder({
              title: "そのドメインは登録されていません。",
              color: Colors.Red
            })
          }
        )
        return
      } else {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder({
              title: "そのドメインは登録されています。",
              color: Colors.Green,
              fields: [
                {
                  name: "パラメータの処理タイプ",
                  value: isDomain.type == "black" ? "拒否リスト" : "許可タイプ",
                  inline: false
                },
                {
                  name: "パラメータ",
                  value: isDomain.items.join(", "),
                  inline: false
                },
              ]
            }),
          }
        )
        return
      }
    }
  });
}
