const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldM, newM) {
    if (oldM.user.bot) return;
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(newM.guild.id);
    if (!gc?.log_channel) return;
    const lc = newM.guild.channels.cache.get(gc.log_channel);
    if (!lc) return;
    const added = newM.roles.cache.filter(r => !oldM.roles.cache.has(r.id));
    const removed = oldM.roles.cache.filter(r => !newM.roles.cache.has(r.id));
    if (added.size > 0) lc.send({ embeds: [new EmbedBuilder().setTitle('Role Added').setDescription(`<@${newM.id}> + ${added.map(r=>`<@&${r.id}>`).join(', ')}`).setColor(config.successColor).setTimestamp()] }).catch(()=>{});
    if (removed.size > 0) lc.send({ embeds: [new EmbedBuilder().setTitle('Role Removed').setDescription(`<@${newM.id}> - ${removed.map(r=>`<@&${r.id}>`).join(', ')}`).setColor(config.warnColor).setTimestamp()] }).catch(()=>{});
  },
};
