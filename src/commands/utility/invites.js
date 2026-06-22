const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('invites').setDescription('Invite stats').addUserOption(o => o.setName('user').setDescription('User')),
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const s = db.prepare('SELECT invites FROM member_stats WHERE guild_id = ? AND user_id = ?').get(interaction.guild.id, target.id);
    const d = db.prepare('SELECT * FROM invites WHERE guild_id = ? AND inviter_id = ? ORDER BY uses DESC').all(interaction.guild.id, target.id);
    const embed = new EmbedBuilder().setTitle(`Invites — ${target.tag}`).setColor(config.infoColor).setTimestamp();
    if (d.length) embed.addFields({ name: 'Total', value: (s?.invites || 0).toString(), inline: true }, { name: 'Codes', value: d.length.toString(), inline: true }, { name: 'Active', value: d.slice(0, 10).map(x => `\`${x.code}\` — **${x.uses}**`).join('\n') });
    else embed.setDescription(`${target.tag} has **${s?.invites || 0}** invite(s).`);
    interaction.reply({ embeds: [embed] });
  },
};
