const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('leaderboard-invites').setDescription('Invite leaderboard'),
  async execute(interaction) {
    const stats = db.prepare('SELECT user_id, invites FROM member_stats WHERE guild_id = ? AND invites > 0 ORDER BY invites DESC LIMIT 15').all(interaction.guild.id);
    if (!stats.length) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('No data.').setColor(config.warnColor)], flags: 64 });
    interaction.reply({ embeds: [new EmbedBuilder().setTitle('Invite Leaderboard').setDescription(stats.map((s, i) => `${['🥇','🥈','🥉'][i] || `**${i+1}.**`} <@${s.user_id}> — **${s.invites}**`).join('\n')).setColor(config.infoColor).setTimestamp()] });
  },
};
