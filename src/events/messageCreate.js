const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
const { xpForLevel } = require('../utils/helpers');
const xpCooldown = new Map();
module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.guild) return;
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(message.guild.id);
    if (!gc) return;
    if (gc.suggestion_channel && message.channel.id === gc.suggestion_channel) {
      await message.delete().catch(()=>{});
      const embed = new EmbedBuilder().setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) }).setDescription(message.content || 'No content').setColor(config.infoColor).setTimestamp().setFooter({ text: `Suggestion by ${message.author.tag}` });
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('suggestion_up').setLabel('0').setEmoji('\u{1f44d}').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('suggestion_down').setLabel('0').setEmoji('\u{1f44e}').setStyle(ButtonStyle.Danger),
      );
      const msg = await message.channel.send({ embeds: [embed], components: [row] });
      db.prepare('INSERT INTO suggestions (guild_id, channel_id, message_id, author_id) VALUES (?, ?, ?, ?)').run(message.guild.id, message.channel.id, msg.id, message.author.id);
      return;
    }
    if (gc.anti_spam) { const r = message.channel.messages.cache.filter(m => m.author.id === message.author.id && Date.now() - m.createdTimestamp < 5000); if (r.size >= 5) { message.delete().catch(()=>{}); message.channel.send({ embeds: [new EmbedBuilder().setDescription(`${message.author}, stop spamming!`).setColor(config.warnColor)] }).then(m => setTimeout(()=>m.delete().catch(()=>{}), 5000)); return; } }
    if (gc.anti_link) { const l = message.content.match(/https?:\/\/[^\s]+/gi); if (l && l.length > (gc.max_links_per_msg || 3)) { message.delete().catch(()=>{}); return; } }
    if (gc.anti_mass_mention) { const c = message.mentions.users.size + message.mentions.roles.size; if (c > (gc.max_mentions_per_msg || 5)) { message.delete().catch(()=>{}); return; } }
    const key = `${message.guild.id}-${message.author.id}`;
    const last = xpCooldown.get(key) || 0;
    if (Date.now() - last >= 60000) {
      xpCooldown.set(key, Date.now());
      const xp = Math.floor(Math.random() * 15) + 5;
      db.prepare('INSERT OR IGNORE INTO member_stats (guild_id, user_id) VALUES (?, ?)').run(message.guild.id, message.author.id);
      db.prepare('UPDATE member_stats SET xp = xp + ?, total_xp = total_xp + ? WHERE guild_id = ? AND user_id = ?').run(xp, xp, message.guild.id, message.author.id);
    }
    db.prepare("UPDATE member_stats SET messages = messages + 1, last_message = datetime('now') WHERE guild_id = ? AND user_id = ?").run(message.guild.id, message.author.id);
    const s = db.prepare('SELECT * FROM member_stats WHERE guild_id = ? AND user_id = ?').get(message.guild.id, message.author.id);
    if (s && s.xp >= xpForLevel(s.level)) {
      const nl = s.level + 1;
      db.prepare('UPDATE member_stats SET level = ?, xp = ? WHERE guild_id = ? AND user_id = ?').run(nl, s.xp - xpForLevel(s.level), message.guild.id, message.author.id);
      const rw = db.prepare('SELECT * FROM level_rewards WHERE guild_id = ? AND level = ?').get(message.guild.id, nl);
      if (rw) { const role = message.guild.roles.cache.get(rw.role_id); if (role) message.member.roles.add(role).catch(()=>{}); }
      if (gc.level_channel) { const ch = message.guild.channels.cache.get(gc.level_channel); if (ch) ch.send({ embeds: [new EmbedBuilder().setTitle('Level Up!').setDescription(`GG ${message.author}, you reached **level ${nl}**!`).setColor(config.gameColor).setTimestamp()] }).catch(()=>{}); }
    }
  },
};
