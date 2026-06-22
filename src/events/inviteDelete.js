const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: Events.InviteDelete,
  async execute(invite) {
    if (!invite.guild) return;
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(invite.guild.id);
    if (!gc?.log_channel) return;
    const ch = invite.guild.channels.cache.get(gc.log_channel);
    if (ch) ch.send({ embeds: [new EmbedBuilder().setTitle('Invite Deleted').addFields({ name: 'Code', value: `\`${invite.code}\`` }).setColor(config.errorColor).setTimestamp()] }).catch(()=>{});
  },
};
