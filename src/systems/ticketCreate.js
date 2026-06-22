const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: 'ticket_create',
  async execute(interaction) {
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(interaction.guild.id);
    if (!gc?.ticket_category) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Ticket system not configured.').setColor(config.errorColor)], flags: 64 });
    const ex = db.prepare("SELECT * FROM tickets WHERE guild_id = ? AND creator_id = ? AND status = 'open'").get(interaction.guild.id, interaction.user.id);
    if (ex) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`You already have an open ticket: <#${ex.channel_id}>`).setColor(config.warnColor)], flags: 64 });
    const embed = new EmbedBuilder().setTitle('Select Ticket Category').setDescription('Choose a category for your ticket.').setColor(config.infoColor).setTimestamp();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_category_support').setLabel('Support').setEmoji('🛠️').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('ticket_category_partner').setLabel('Partnership').setEmoji('🤝').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('ticket_category_report').setLabel('Report').setEmoji('⚠️').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('ticket_category_other').setLabel('Other').setEmoji('📝').setStyle(ButtonStyle.Secondary)
    );
    await interaction.reply({ embeds: [embed], components: [row], flags: 64 });
  },
};
