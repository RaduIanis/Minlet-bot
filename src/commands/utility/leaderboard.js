const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Leaderboard').addStringOption(o => o.setName('type').setDescription('Leaderboard type').addChoices({ name: 'XP', value: 'xp' }, { name: 'Messages', value: 'messages' }, { name: 'Invites', value: 'invites' })),
  async execute(interaction) {
    const type = interaction.options.getString('type') || 'xp';
    const col = type === 'xp' ? 'total_xp' : type;
    const stats = db.prepare(`SELECT user_id, ${col} as value, level FROM member_stats WHERE guild_id = ? ORDER BY ${col} DESC LIMIT 15`).all(interaction.guild.id);
    if (!stats.length) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('No data.').setColor(config.warnColor)], flags: 64 });
    const medals = ['🥇', '🥈', '🥉'];
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Leaderboard — ${type}`).setDescription(stats.map((s, i) => `${medals[i] || `**${i+1}.**`} <@${s.user_id}> — **${s.value.toLocaleString()}**${type === 'xp' ? ` (Lv. ${s.level})` : ''}`).join('\n')).setColor(config.gameColor).setTimestamp()] });
  },
};
