const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('coinflip').setDescription('Flip a coin'),
  async execute(interaction) { const r = Math.random() < 0.5 ? 'Heads' : 'Tails'; interaction.reply({ embeds: [new EmbedBuilder().setTitle('🪙 Coin Flip').setDescription(`**${r}**!`).setColor(r === 'Heads' ? config.successColor : config.warnColor).setTimestamp()] }); },
};
