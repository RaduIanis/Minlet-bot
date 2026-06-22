const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldS, newS) {
    const m = newS.member || oldS.member;
    if (!m || m.user.bot || !m.guild) return;
    if (oldS.channel && !newS.channel) {
      const s = Math.floor((Date.now() - (oldS.joinTimestamp || Date.now())) / 1000);
      if (s > 0) { db.prepare('INSERT OR IGNORE INTO member_stats (guild_id, user_id) VALUES (?, ?)').run(m.guild.id, m.id); db.prepare("UPDATE member_stats SET voice_time = voice_time + ?, last_voice = datetime('now') WHERE guild_id = ? AND user_id = ?").run(s, m.guild.id, m.id); }
    }
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(m.guild.id);
    if (!gc?.log_channel) return;
    const lc = m.guild.channels.cache.get(gc.log_channel);
    if (!lc) return;
    let e;
    if (!oldS.channel && newS.channel) e = new EmbedBuilder().setTitle('Voice Joined').setDescription(`<@${m.id}> joined <#${newS.channel.id}>`).setColor(config.successColor).setTimestamp();
    else if (oldS.channel && !newS.channel) e = new EmbedBuilder().setTitle('Voice Left').setDescription(`<@${m.id}> left <#${oldS.channel.id}>`).setColor(config.errorColor).setTimestamp();
    else if (oldS.channel !== newS.channel) e = new EmbedBuilder().setTitle('Voice Moved').setDescription(`<@${m.id}> from <#${oldS.channel.id}> to <#${newS.channel.id}>`).setColor(config.infoColor).setTimestamp();
    if (e) lc.send({ embeds: [e] }).catch(()=>{});
  },
};
