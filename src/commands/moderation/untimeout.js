const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('untimeout').setDescription('Remove timeout').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not found.').setColor(config.errorColor)], flags: 64 });
    if (!member.isCommunicationDisabled()) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not timed out.').setColor(config.warnColor)], flags: 64 });
    await member.timeout(null);
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Timeout removed for **${target.tag}**.`).setColor(config.successColor)] });
  },
};
