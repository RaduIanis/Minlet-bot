const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: Events.InviteCreate,
  async execute(invite) {
    if (!invite.guild) return;
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(invite.guild.id);
    if (!gc?.log_channel) return;
    const ch = invite.guild.channels.cache.get(gc.log_channel);
    if (ch) ch.send({ embeds: [new EmbedBuilder().setTitle('Invite Created').addFields({ name: 'Code', value: `\`${invite.code}\``, inline: true }, { name: 'By', value: `<@${invite.inviter.id}>`, inline: true }).setColor(config.infoColor).setTimestamp()] }).catch(()=>{});
  },
};
