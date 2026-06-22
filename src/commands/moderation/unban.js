const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('unban').setDescription('Unban a user').addStringOption(o => o.setName('userid').setDescription('User ID').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    try { const ban = await interaction.guild.bans.fetch(interaction.options.getString('userid')); await interaction.guild.members.unban(interaction.options.getString('userid')); interaction.reply({ embeds: [new EmbedBuilder().setTitle('✅ Unbanned').setDescription(`**${ban.user.tag}** unbanned.`).setColor(config.successColor)] }); }
    catch { interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not banned.').setColor(config.errorColor)], flags: 64 }); }
  },
};
