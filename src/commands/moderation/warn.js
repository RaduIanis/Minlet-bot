const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('warn').setDescription('Warn a member').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason')).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason';
    db.prepare('INSERT INTO warnings (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)').run(interaction.guild.id, target.id, interaction.user.id, reason);
    const w = db.prepare('SELECT COUNT(*) as c FROM warnings WHERE guild_id = ? AND user_id = ?').get(interaction.guild.id, target.id);
    interaction.reply({ embeds: [new EmbedBuilder().setTitle('⚠️ Warned').setDescription(`**${target.tag}** warned.`).addFields({ name: 'Reason', value: reason }, { name: 'Total', value: w.c.toString(), inline: true }).setColor(config.warnColor).setTimestamp()] });
  },
};
