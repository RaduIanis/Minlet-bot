const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('nick').setDescription('Change nickname').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('nickname').setDescription('Nickname')).setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const nick = interaction.options.getString('nickname') || null;
    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not found.').setColor(config.errorColor)], flags: 64 });
    await member.setNickname(nick);
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`${target.tag}'s nickname ${nick ? 'set' : 'reset'}.`).setColor(config.successColor)] });
  },
};
