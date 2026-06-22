const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('kick').setDescription('Kick a member').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason')).setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason';
    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('User not found.').setColor(config.errorColor)], flags: 64 });
    if (!member.kickable) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Cannot kick.').setColor(config.errorColor)], flags: 64 });
    await member.kick(`${reason} | By ${interaction.user.tag}`);
    interaction.reply({ embeds: [new EmbedBuilder().setTitle('👢 Kicked').setDescription(`**${target.tag}** kicked.`).addFields({ name: 'Reason', value: reason }).setColor(config.warnColor).setTimestamp()] });
  },
};
