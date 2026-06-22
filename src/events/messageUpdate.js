const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: Events.MessageUpdate,
  async execute(old, newMsg) {
    if (!old.guild || !old.author || old.author.bot) return;
    if (old.content === newMsg.content) return;
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(old.guild.id);
    if (!gc?.log_channel) return;
    const lc = old.guild.channels.cache.get(gc.log_channel);
    if (!lc) return;
    lc.send({ embeds: [new EmbedBuilder().setTitle('Message Edited').setDescription(`<@${old.author.id}> in <#${old.channel.id}>`).addFields({ name: 'Before', value: old.content.slice(0, 1024) || 'Empty' }, { name: 'After', value: newMsg.content.slice(0, 1024) || 'Empty' }).setColor(config.infoColor).setTimestamp()] }).catch(()=>{});
  },
};
