const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('stats').setDescription('Your stats'),
  async execute(interaction) {
    const s = db.prepare('SELECT * FROM member_stats WHERE guild_id = ? AND user_id = ?').get(interaction.guild.id, interaction.user.id);
    if (!s) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('No stats.').setColor(config.warnColor)], flags: 64 });
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Stats — ${interaction.user.tag}`).setThumbnail(interaction.user.displayAvatarURL({ dynamic: true })).addFields({ name: 'Level', value: s.level.toString(), inline: true }, { name: 'XP', value: s.xp.toString(), inline: true }, { name: 'Total XP', value: s.total_xp.toLocaleString(), inline: true }, { name: 'Messages', value: s.messages.toLocaleString(), inline: true }, { name: 'Invites', value: s.invites.toString(), inline: true }, { name: 'Voice', value: `${Math.floor(s.voice_time/3600)}h ${Math.floor((s.voice_time%3600)/60)}m`, inline: true }).setColor(config.gameColor).setTimestamp()] });
  },
};
