const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const facts = ['Octopuses have 3 hearts.', "Bananas are berries, strawberries aren't.", 'Honey never spoils.', 'Wombat poop is cube-shaped.', 'Cows have best friends.', 'Hot water freezes faster than cold.'];
module.exports = {
  data: new SlashCommandBuilder().setName('fact').setDescription('Random fact'),
  async execute(interaction) { interaction.reply({ embeds: [new EmbedBuilder().setTitle('Fun Fact').setDescription(facts[Math.floor(Math.random() * facts.length)]).setColor(config.gameColor).setTimestamp()] }); },
};
