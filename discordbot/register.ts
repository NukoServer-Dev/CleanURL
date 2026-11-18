import { REST, Routes } from "discord.js";

import { config } from "dotenv";
import { commandData } from "./commands.ts";

config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

let commands = [];
for (const command of commandData) {
    commands.push(command.toJSON())
}

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
		const data = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string), { body: commands });

		console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();