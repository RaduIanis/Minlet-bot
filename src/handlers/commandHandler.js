const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

module.exports = (client) => {
  client.commands = new Collection();
  let total = 0;
  for (const folder of fs.readdirSync(path.join(__dirname, '..', 'commands'))) {
    for (const file of fs.readdirSync(path.join(__dirname, '..', 'commands', folder)).filter((f) => f.endsWith('.js'))) {
      const cmd = require(path.join(__dirname, '..', 'commands', folder, file));
      if (cmd.data && cmd.execute) { client.commands.set(cmd.data.name, { ...cmd, category: folder }); total++; }
    }
  }
  console.log(`[Minlet] Loaded ${total} commands`);
};
