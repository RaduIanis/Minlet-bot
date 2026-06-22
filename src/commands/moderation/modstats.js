const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('modstats').setDescription('Mod stats').setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const g = interaction.guild.id;
    interaction.reply({ embeds: [new EmbedBuilder().setTitle('Mod Stats').addFields({ name: 'Warnings', value: db.prepare('SELECT COUNT(*) as c FROM warnings WHERE guild_id = ?').get(g).c.toString(), inline: true }, { name: 'Mutes', value: db.prepare('SELECT COUNT(*) as c FROM mutes WHERE guild_id = ?').get(g).c.toString(), inline: true }, { name: 'Notes', value: db.prepare('SELECT COUNT(*) as c FROM notes WHERE guild_id = ?').get(g).c.toString(), inline: true }).setColor(config.infoColor).setTimestamp()] });
  },
};
