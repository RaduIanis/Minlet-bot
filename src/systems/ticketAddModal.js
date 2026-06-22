const { EmbedBuilder } = require('discord.js');
const config = require('../config');
module.exports = {
  name: 'ticket_add_modal',
  async execute(interaction) {
    const userId = interaction.fields.getTextInputValue('user_id').replace(/[<@!>]/g, '');
    try { const m = await interaction.guild.members.fetch(userId); await interaction.channel.permissionOverwrites.edit(userId, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }); interaction.reply({ embeds: [new EmbedBuilder().setDescription(`✅ <@${userId}> added.`).setColor(config.successColor)] }); }
    catch { interaction.reply({ embeds: [new EmbedBuilder().setDescription('User not found.').setColor(config.errorColor)], flags: 64 }); }
  },
};
