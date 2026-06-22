const { Events } = require('discord.js');
const db = require('../database/schema');
module.exports = {
  name: Events.ClientReady, once: true,
  execute(client) {
    client.guilds.cache.forEach((g) => db.prepare('INSERT OR IGNORE INTO guild_config (guild_id) VALUES (?)').run(g.id));
    setInterval(() => {
      const r = db.prepare("SELECT * FROM reminder WHERE remind_at <= datetime('now')").all();
      for (const x of r) { const ch = client.channels.cache.get(x.channel_id); if (ch) client.users.cache.get(x.user_id)?.send(`Reminder: ${x.content}`).catch(()=>{}); db.prepare('DELETE FROM reminder WHERE id = ?').run(x.id); }
    }, 60000);
    setInterval(() => {
      const m = db.prepare("SELECT * FROM mutes WHERE active = 1 AND expires_at IS NOT NULL AND expires_at <= datetime('now')").all();
      for (const x of m) { const g = client.guilds.cache.get(x.guild_id); if (!g) continue; const mb = g.members.cache.get(x.user_id); if (!mb) continue; const c = db.prepare('SELECT mute_role FROM guild_config WHERE guild_id = ?').get(x.guild_id); if (c?.mute_role) mb.roles.remove(c.mute_role).catch(()=>{}); db.prepare('UPDATE mutes SET active = 0 WHERE id = ?').run(x.id); mb.send(`Unmuted in **${g.name}**.`).catch(()=>{}); }
    }, 30000);
  },
};
