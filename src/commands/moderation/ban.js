const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('ban').setDescription('Ban a member').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason')).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason';
    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('User not found.').setColor(config.errorColor)], flags: 64 });
    if (!member.bannable) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Cannot ban this user.').setColor(config.errorColor)], flags: 64 });
    await member.ban({ reason: `${reason} | By ${interaction.user.tag}` });
    interaction.reply({ embeds: [new EmbedBuilder().setTitle('🔨 Banned').setDescription(`**${target.tag}** banned.`).addFields({ name: 'Reason', value: reason }).setColor(config.errorColor).setTimestamp()] });
  },
};
