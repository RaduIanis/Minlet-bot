const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('dice').setDescription('Roll dice').addIntegerOption(o => o.setName('sides').setDescription('Number of sides').setMinValue(2).setMaxValue(100)),
  async execute(interaction) { const s = interaction.options.getInteger('sides') || 6; interaction.reply({ embeds: [new EmbedBuilder().setTitle('Dice Roll').setDescription(`**${Math.floor(Math.random() * s) + 1}** (${s} sides)`).setColor(config.gameColor).setTimestamp()] }); },
};
