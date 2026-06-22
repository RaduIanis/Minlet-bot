const { EmbedBuilder } = require('discord.js');
const config = require('../config');
module.exports = {
  name: 'ticket_remove_modal',
  async execute(interaction) {
    const userId = interaction.fields.getTextInputValue('user_id').replace(/[<@!>]/g, '');
    try { await interaction.channel.permissionOverwrites.delete(userId); interaction.reply({ embeds: [new EmbedBuilder().setDescription(`✅ <@${userId}> removed.`).setColor(config.successColor)] }); }
    catch { interaction.reply({ embeds: [new EmbedBuilder().setDescription('Error.').setColor(config.errorColor)], flags: 64 }); }
  },
};
