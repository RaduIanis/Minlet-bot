const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
const { xpForLevel, progressBar } = require('../../utils/helpers');
module.exports = {
  data: new SlashCommandBuilder().setName('rank').setDescription('Check rank').addUserOption(o => o.setName('user').setDescription('User')),
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const s = db.prepare('SELECT * FROM member_stats WHERE guild_id = ? AND user_id = ?').get(interaction.guild.id, target.id);
    if (!s) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('No stats.').setColor(config.warnColor)], flags: 64 });
    const req = xpForLevel(s.level);
    const all = db.prepare('SELECT user_id, total_xp FROM member_stats WHERE guild_id = ? ORDER BY total_xp DESC').all(interaction.guild.id);
    const rank = all.findIndex(x => x.user_id === target.id) + 1;
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${target.tag}'s Rank`).setThumbnail(target.displayAvatarURL({ dynamic: true })).addFields({ name: 'Level', value: `**${s.level}**`, inline: true }, { name: 'Rank', value: `**#${rank}**`, inline: true }, { name: 'XP', value: `${s.xp}/${req}`, inline: true }, { name: 'Messages', value: s.messages.toLocaleString(), inline: true }, { name: 'Progress', value: `${progressBar(s.xp, req)} ${Math.round((s.xp / req) * 100)}%` }).setColor(config.gameColor).setTimestamp()] });
  },
};
