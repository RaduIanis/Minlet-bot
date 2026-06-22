const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('enable').setDescription('Enable command').addStringOption(o => o.setName('command').setDescription('Command to enable').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const name = interaction.options.getString('command').toLowerCase();
    const r = db.prepare('DELETE FROM disabled_commands WHERE guild_id = ? AND command_name = ?').run(interaction.guild.id, name);
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(r.changes ? `\`${name}\` enabled.` : `\`${name}\` not disabled.`).setColor(config.successColor)] });
  },
};
