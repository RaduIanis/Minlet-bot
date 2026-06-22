const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    if (!message.guild || !message.author || message.author.bot) return;
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(message.guild.id);
    if (!gc?.log_channel) return;
    const lc = message.guild.channels.cache.get(gc.log_channel);
    if (!lc) return;
    lc.send({ embeds: [new EmbedBuilder().setTitle('Message Deleted').setDescription(`By <@${message.author.id}> in <#${message.channel.id}>`).addFields({ name: 'Content', value: message.content.slice(0, 1024) || 'Empty' }).setColor(config.errorColor).setTimestamp()] }).catch(()=>{});
  },
};
