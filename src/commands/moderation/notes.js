const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('notes').setDescription('View notes').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const t = interaction.options.getUser('user');
    const notes = db.prepare('SELECT * FROM notes WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC').all(interaction.guild.id, t.id);
    if (!notes.length) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`No notes for **${t.tag}**.`).setColor(config.infoColor)], flags: 64 });
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Notes — ${t.tag}`).setDescription(notes.slice(0, 25).map((n, i) => `**#${i+1}** | <@${n.moderator_id}> — ${n.content}`).join('\n')).setColor(config.infoColor).setTimestamp()] });
  },
};
