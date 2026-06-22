const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('disable').setDescription('Disable command').addStringOption(o => o.setName('command').setDescription('Command to disable').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const name = interaction.options.getString('command').toLowerCase();
    if (!interaction.client.commands.get(name)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`\`${name}\` not found.`).setColor(config.errorColor)], flags: 64 });
    db.prepare('INSERT OR IGNORE INTO disabled_commands (guild_id, command_name, disabled_by) VALUES (?, ?, ?)').run(interaction.guild.id, name, interaction.user.id);
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`\`${name}\` disabled.`).setColor(config.successColor)] });
  },
};
