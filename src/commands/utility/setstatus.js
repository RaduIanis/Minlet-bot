const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('setstatus').setDescription('Set bot status').addStringOption(o => o.setName('type').setDescription('Status type').addChoices({ name: 'Playing', value: '0' }, { name: 'Watching', value: '3' }, { name: 'Listening', value: '2' }).setRequired(true)).addStringOption(o => o.setName('text').setDescription('Status text').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    client.user.setActivity(interaction.options.getString('text'), { type: parseInt(interaction.options.getString('type')) });
    interaction.reply({ embeds: [new EmbedBuilder().setDescription('Status set.').setColor(config.successColor)], flags: 64 });
  },
};
