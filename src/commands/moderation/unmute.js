const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('unmute').setDescription('Unmute a member').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('User not found.').setColor(config.errorColor)], flags: 64 });
    if (!member.isCommunicationDisabled()) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not muted.').setColor(config.warnColor)], flags: 64 });
    await member.timeout(null);
    db.prepare("UPDATE mutes SET active = 0 WHERE guild_id = ? AND user_id = ? AND active = 1").run(interaction.guild.id, target.id);
    interaction.reply({ embeds: [new EmbedBuilder().setTitle('🔊 Unmuted').setDescription(`**${target.tag}** unmuted.`).setColor(config.successColor)] });
  },
};
