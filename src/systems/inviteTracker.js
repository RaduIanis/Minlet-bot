const { Events } = require('discord.js');
const db = require('../database/schema');
module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    if (!member.guild) return;
    const invites = await member.guild.invites.fetch();
    const cached = db.prepare('SELECT * FROM invites WHERE guild_id = ?').all(member.guild.id);
    for (const inv of invites.values()) {
      if (inv.code === member.guild.vanityURLCode || !inv.inviter) continue;
      const c = cached.find(x => x.code === inv.code);
      if (c) { if (inv.uses > c.uses) { db.prepare('UPDATE invites SET uses = ? WHERE id = ?').run(inv.uses, c.id); db.prepare('INSERT INTO invite_uses (invite_id, guild_id, inviter_id, user_id) VALUES (?, ?, ?, ?)').run(c.id, member.guild.id, inv.inviter.id, member.id); db.prepare('UPDATE member_stats SET invites = invites + 1 WHERE guild_id = ? AND user_id = ?').run(member.guild.id, inv.inviter.id); } }
      else db.prepare('INSERT INTO invites (guild_id, inviter_id, code, uses) VALUES (?, ?, ?, ?)').run(member.guild.id, inv.inviter.id, inv.code, inv.uses);
    }
  },
};
