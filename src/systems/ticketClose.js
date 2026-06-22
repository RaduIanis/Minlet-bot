const { EmbedBuilder } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: 'ticket_close',
  async execute(interaction) {
    const t = db.prepare("SELECT * FROM tickets WHERE channel_id = ? AND status = 'open'").get(interaction.channel.id);
    if (!t) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not an open ticket.').setColor(config.errorColor)], flags: 64 });
    if (t.creator_id !== interaction.user.id && !interaction.member.permissions.has('ManageMessages')) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Only creator or staff.').setColor(config.errorColor)], flags: 64 });
    db.prepare("UPDATE tickets SET status = 'closed', closed_at = datetime('now'), closed_by = ? WHERE id = ?").run(interaction.user.id, t.id);
    await interaction.reply({ embeds: [new EmbedBuilder().setTitle('Ticket Closed').setDescription(`Closed by <@${interaction.user.id}>. Deleting in 10s.`).setColor(config.warnColor).setTimestamp()] });
    await interaction.message.edit({ components: [{ type: 1, components: [{ type: 2, label: 'Closed', style: 2, disabled: true, custom_id: 'x' }] }] }).catch(()=>{});
    setTimeout(() => interaction.channel.delete().catch(()=>{}), 10000);
  },
};
