const { GatewayIntentBits, Partials } = require('discord.js');

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  embedColor: '#2f3136',
  successColor: '#57f287',
  errorColor: '#ed4245',
  warnColor: '#fee75c',
  infoColor: '#5865f2',
  gameColor: '#eb459e',
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildInvites, GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User],
};
