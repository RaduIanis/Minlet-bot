const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('warnings').setDescription('View warnings').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const warns = db.prepare('SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC').all(interaction.guild.id, target.id);
    if (!warns.length) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`✅ ${target.tag} has no warnings.`).setColor(config.successColor)], flags: 64 });
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Warnings — ${target.tag}`).setDescription(warns.slice(0, 25).map((w, i) => `**#${i+1}** | <@${w.moderator_id}> — ${w.reason}`).join('\n')).setFooter({ text: `${warns.length} total` }).setColor(config.warnColor).setTimestamp()] });
  },
};
