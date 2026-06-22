const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('say').setDescription('Make bot say something').addStringOption(o => o.setName('message').setDescription('Message to say').setRequired(true)),
  async execute(interaction) { interaction.reply({ content: interaction.options.getString('message') }); },
};
