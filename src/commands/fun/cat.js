const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('cat').setDescription('Random ASCII cat'),
  async execute(interaction) { const c = ['```\\n  /\\\\_/\\\\\\n ( o.o )\\n  > ^ <\\n```', '```\\n  ^__^\\n (oo)\\\\_______\\n (__)\\\\       )\\\\/\\\\\\n     ||----w |\\n```']; interaction.reply({ embeds: [new EmbedBuilder().setTitle('Cat').setDescription(c[Math.floor(Math.random() * c.length)]).setColor(config.gameColor).setTimestamp()] }); },
};
