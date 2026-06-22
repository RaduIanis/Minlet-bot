const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('role').setDescription('Add/remove role').addSubcommand(s => s.setName('add').setDescription('Add a role to a user').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))).addSubcommand(s => s.setName('remove').setDescription('Remove a role from a user').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))).setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not found.').setColor(config.errorColor)], flags: 64 });
    if (interaction.options.getSubcommand() === 'add') { await member.roles.add(role); interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Added <@&${role.id}> to <@${user.id}>.`).setColor(config.successColor)] }); }
    else { await member.roles.remove(role); interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Removed <@&${role.id}> from <@${user.id}>.`).setColor(config.successColor)] }); }
  },
};
