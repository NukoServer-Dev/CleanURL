import {
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type Client,
} from "discord.js";

import { countParams, paramData } from "./url";

export const commandData = [
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Botの使い方を表示します。"),
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Botのステータスを表示します。"),
  new SlashCommandBuilder()
    .setName("check")
    .setDescription("そのドメインが対応しているかを確認します。")
    .addStringOption((option) =>
      option
        .setName("domain")
        .setDescription("確認するドメイン")
        .setRequired(true)
    ),
];

async function handleHelp(interaction: ChatInputCommandInteraction) {
  const topEmbed = new EmbedBuilder()
    .setTitle("URL Cleanerの使い方")
    .setColor(Colors.Blue)
    .setDescription("URLの不要なパラメータを\n自動で編集することができます。");

  const detailEmbed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .addFields(
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
      }
    )
    .setFooter({ text: "ぬこぬこサーバー" });

  await interaction.editReply({ embeds: [topEmbed, detailEmbed] });
}

async function handleStatus(interaction: ChatInputCommandInteraction) {
  const totalParams = countParams();

  const embed = new EmbedBuilder()
    .setTitle("Botのステータス")
    .setColor(Colors.Blue)
    .addFields({
      name: "登録パラメータ数",
      value: `${totalParams}個`,
      inline: true,
    });

  await interaction.editReply({ embeds: [embed] });
}

async function handleCheck(interaction: ChatInputCommandInteraction) {
  const domain = interaction.options.getString("domain", true).trim();
  const domainConfig = paramData.get(domain);

  if (!domainConfig) {
    const notFoundEmbed = new EmbedBuilder()
      .setTitle("そのドメインは登録されていません。")
      .setColor(Colors.Red);

    await interaction.editReply({ embeds: [notFoundEmbed] });
    return;
  }

  const processTypeLabel =
    domainConfig.type === "black" ? "拒否リスト" : "許可タイプ";

  const itemsText =
    domainConfig.items.length > 0 ? domainConfig.items.join(", ") : "なし";

  const safeItemsText =
    itemsText.length > 1024 ? `${itemsText.slice(0, 1021)}...` : itemsText;

  const foundEmbed = new EmbedBuilder()
    .setTitle("そのドメインは登録されています。")
    .setColor(Colors.Green)
    .addFields(
      {
        name: "パラメータの処理タイプ",
        value: processTypeLabel,
        inline: false,
      },
      {
        name: "パラメータ",
        value: safeItemsText,
        inline: false,
      }
    );

  await interaction.editReply({ embeds: [foundEmbed] });
}

export async function registerCommands(client: Client) {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
      await interaction.deferReply();

      switch (interaction.commandName) {
        case "help":
          await handleHelp(interaction);
          break;
        case "status":
          await handleStatus(interaction);
          break;
        case "check":
          await handleCheck(interaction);
          break;
        default:
          await interaction.editReply("不明なコマンドです。");
          break;
      }
    } catch (error) {
      console.error(`コマンド実行エラー (${interaction.commandName}):`, error);

      if (interaction.deferred || interaction.replied) {
        await interaction
          .editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("エラーが発生しました。")
                .setDescription("時間をおいてもう一度お試しください。")
                .setColor(Colors.Red),
            ],
          })
          .catch(() => {});
      }
    }
  });
}
