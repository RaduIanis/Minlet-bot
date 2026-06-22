require('dotenv').config();
const { Client } = require('discord.js');
const config = require('./config');

const client = new Client({
  intents: config.intents, partials: config.partials,
  presence: { activities: [{ name: 'Minlet | /help', type: 0 }], status: 'online' },
});

require('./handlers/commandHandler')(client);
require('./handlers/eventHandler')(client);

client.once('ready', () => console.log(`[Minlet] Logged in as ${client.user.tag} | ${client.guilds.cache.size} guilds`));
client.on('error', (err) => console.error('[Minlet]', err));
process.on('unhandledRejection', (err) => console.error('[Minlet]', err));

client.login(config.token);
