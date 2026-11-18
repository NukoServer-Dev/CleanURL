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
                    embeds: [new EmbedBuilder({
                        title: "URL Cleanerの使い方",
                        color: Colors.Blue,
                        description: "URLの不要なパラメータを\n自動で編集することができます。\n\n自動で編集してほしくないチャンネルでは、\nこのBotの閲覧権限を剥奪することで\n削除できなくできます。"
                    })]
                })
                return
            }
        }
    })
}