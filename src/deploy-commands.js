const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
for (const folder of fs.readdirSync(path.join(__dirname, 'commands'))) {
  for (const file of fs.readdirSync(path.join(__dirname, 'commands', folder)).filter((f) => f.endsWith('.js'))) {
    const cmd = require(path.join(__dirname, 'commands', folder, file));
    if (cmd.data) commands.push(cmd.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log(`[Deploy] Registering ${commands.length} commands...`);
    if (process.env.GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
      console.log(`[Deploy] Done — ${commands.length} commands to guild ${process.env.GUILD_ID}`);
    } else {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      console.log(`[Deploy] Done — ${commands.length} commands globally`);
    }
  } catch (err) { console.error('[Deploy]', err); }
})();
