const { Events } = require('discord.js');
const db = require('../database/schema');
module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (user.bot || !reaction.message.guild) return;
    const g = reaction.message.guild.id;
    db.prepare('UPDATE member_stats SET reactions_given = reactions_given + 1 WHERE guild_id = ? AND user_id = ?').run(g, user.id);
    if (reaction.message.author) db.prepare('UPDATE member_stats SET reactions_received = reactions_received + 1 WHERE guild_id = ? AND user_id = ?').run(g, reaction.message.author.id);
  },
};
