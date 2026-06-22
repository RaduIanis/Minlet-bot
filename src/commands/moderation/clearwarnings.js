const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('clearwarnings').setDescription('Clear warnings').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const r = db.prepare('DELETE FROM warnings WHERE guild_id = ? AND user_id = ?').run(interaction.guild.id, target.id);
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Cleared **${r.changes}** warnings for **${target.tag}**.`).setColor(config.successColor)] });
  },
};
