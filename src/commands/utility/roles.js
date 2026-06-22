const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('roles').setDescription('List roles'),
  async execute(interaction) {
    const roles = interaction.guild.roles.cache.filter(r => r.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map(r => `${r} — ${r.members.size}`);
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Roles — ${interaction.guild.name}`).setDescription(roles.slice(0, 25).join('\n') || 'None').setColor(config.infoColor).setFooter({ text: `${roles.length} roles` }).setTimestamp()] });
  },
};
