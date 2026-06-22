const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('mute').setDescription('Mute a member').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('duration').setDescription('Duration (e.g. 10m, 1h)').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason')).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const dur = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason';
    const match = dur.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Invalid duration. Use 10m, 1h, 1d.').setColor(config.errorColor)], flags: 64 });
    const ms = parseInt(match[1]) * { s: 1000, m: 60000, h: 3600000, d: 86400000 }[match[2]];
    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('User not found.').setColor(config.errorColor)], flags: 64 });
    if (!member.moderatable) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Cannot mute.').setColor(config.errorColor)], flags: 64 });
    await member.timeout(ms, `${reason} | By ${interaction.user.tag}`);
    db.prepare("INSERT INTO mutes (guild_id, user_id, moderator_id, reason, duration, expires_at) VALUES (?, ?, ?, ?, ?, datetime('now', ? || ' seconds'))").run(interaction.guild.id, target.id, interaction.user.id, reason, dur, Math.floor(ms / 1000));
    interaction.reply({ embeds: [new EmbedBuilder().setTitle('🔇 Muted').setDescription(`**${target.tag}** muted for ${dur}.`).addFields({ name: 'Reason', value: reason }).setColor(config.warnColor).setTimestamp()] });
  },
};
