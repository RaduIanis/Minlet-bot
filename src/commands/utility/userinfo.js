const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('userinfo').setDescription('User info').addUserOption(o => o.setName('user').setDescription('User')),
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(target.id);
    const fields = [{ name: 'Account', value: `**User:** ${target.tag}\n**ID:** ${target.id}\n**Created:** <t:${Math.floor(target.createdTimestamp / 1000)}:R>` }];
    if (member) { const s = db.prepare('SELECT * FROM member_stats WHERE guild_id = ? AND user_id = ?').get(interaction.guild.id, target.id); fields.push({ name: 'Server', value: `**Joined:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>\n**Roles:** ${member.roles.cache.size - 1}`, inline: true }, { name: 'Stats', value: `**Level:** ${s?.level || 0}\n**Messages:** ${s?.messages || 0}\n**XP:** ${s?.xp || 0}`, inline: true }); }
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(target.tag).setThumbnail(target.displayAvatarURL({ dynamic: true })).addFields(fields).setColor(config.infoColor).setTimestamp()] });
  },
};
