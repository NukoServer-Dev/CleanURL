import { Colors, EmbedBuilder, InteractionType, SlashCommandBuilder, type Client } from "discord.js";

export const commandData = [
    new SlashCommandBuilder()
	.setName('help')
	.setDescription('Botの使い方を表示します'),
];

export async function registerCommands(client: Client) {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.type == InteractionType.ApplicationCommand) {
            if (interaction.commandName == "help") {
                await interaction.deferReply();
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder({
                            title: "URL Cleanerの使い方",
                            color: Colors.Blue,
                            description: "URLの不要なパラメータを\n自動で編集することができます。\n\n"
                        }),
                        new EmbedBuilder({
                            color: Colors.Blue,
                            fields: [
                                {
                                    name: "自動で編集してほしくないチャンネルがある",
                                    value: "自動で編集してほしくないチャンネルでは、\nこのBotの閲覧権限を剥奪することで\n編集できなくできます。",
                                    inline: false
                                },
                                {
                                    name: "メンションについて",
                                    value: "メンションは自動的に無効化されます。",
                                    inline: false
                                }
                            ],
                            footer: {
                                text: "ぬこぬこサーバー"
                            }
                        })
                    ]
                })
                return
            }
        }
    })
}