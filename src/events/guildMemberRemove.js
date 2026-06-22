const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(member.guild.id);
    if (!gc) return;
    if (gc.farewell_channel) {
      const ch = member.guild.channels.cache.get(gc.farewell_channel);
      if (ch) {
        const msg = (gc.farewell_message || '{user} has left.').replace(/{user}/g, member.user.tag).replace(/{server}/g, member.guild.name).replace(/{membercount}/g, member.guild.memberCount);
        ch.send({ embeds: [new EmbedBuilder().setTitle('Goodbye!').setDescription(msg).setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 })).setColor(config.errorColor).setTimestamp()] }).catch(()=>{});
      }
    }
    if (gc.log_channel) {
      const lc = member.guild.channels.cache.get(gc.log_channel);
      if (lc) lc.send({ embeds: [new EmbedBuilder().setTitle('Member Left').setDescription(`<@${member.id}> (${member.user.tag})`).addFields({ name: 'Joined', value: member.joinedAt ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true }, { name: 'Count', value: member.guild.memberCount.toString(), inline: true }).setColor(config.errorColor).setTimestamp()] }).catch(()=>{});
    }
  },
};
