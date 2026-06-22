const { EmbedBuilder } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: 'ticket_claim',
  async execute(interaction) {
    const t = db.prepare("SELECT * FROM tickets WHERE channel_id = ? AND status = 'open'").get(interaction.channel.id);
    if (!t) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not an open ticket.').setColor(config.errorColor)], flags: 64 });
    if (!interaction.member.permissions.has('ManageMessages')) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Staff only.').setColor(config.errorColor)], flags: 64 });
    if (t.claimed_by) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Already claimed by <@${t.claimed_by}>.`).setColor(config.warnColor)], flags: 64 });
    db.prepare('UPDATE tickets SET claimed_by = ? WHERE id = ?').run(interaction.user.id, t.id);
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`✅ Claimed by <@${interaction.user.id}>`).setColor(config.successColor)] });
  },
};
