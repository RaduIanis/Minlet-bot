const { EmbedBuilder } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: 'reactionrole_select',
  async execute(interaction) {
    const roleId = interaction.values[0];
    const rr = db.prepare('SELECT reaction_roles FROM guild_config WHERE guild_id = ?').get(interaction.guild.id);
    const rrs = JSON.parse(rr?.reaction_roles || '[]');
    const r = rrs.find(x => x.messageId === interaction.message.id);
    if (!r) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Config not found.').setColor(config.errorColor)], flags: 64 });
    if (interaction.member.roles.cache.has(roleId)) { await interaction.member.roles.remove(roleId); interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Removed <@&${roleId}>.`).setColor(config.warnColor)], flags: 64 }); }
    else { await interaction.member.roles.add(roleId); interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Added <@&${roleId}>.`).setColor(config.successColor)], flags: 64 }); }
  },
};
