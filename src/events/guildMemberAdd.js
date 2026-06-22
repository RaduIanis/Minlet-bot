const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(member.guild.id);
    if (!gc) return;
    db.prepare('INSERT OR IGNORE INTO member_stats (guild_id, user_id) VALUES (?, ?)').run(member.guild.id, member.id);
    if (gc.autorole) { const r = member.guild.roles.cache.get(gc.autorole); if (r) member.roles.add(r).catch(()=>{}); }
    if (gc.welcome_channel) {
      const ch = member.guild.channels.cache.get(gc.welcome_channel);
      if (ch) {
        const daysOld = Math.floor((Date.now() - member.user.createdTimestamp) / 86400000);
        const banner = member.user.bannerURL({ dynamic: true, size: 1024 });
        const embed = new EmbedBuilder().setTitle(`Welcome to ${member.guild.name}!`)
          .setDescription(`Hey ${member}, welcome to **${member.guild.name}**!\n\nWe're glad to have you here!\n\n> **Account:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n> **Member #:** ${member.guild.memberCount}` + (daysOld < 7 ? '\n> ⚠️ **New Account**' : ''))
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
          .setColor(config.successColor).setFooter({ text: `Member #${member.guild.memberCount}` }).setTimestamp();
        if (banner) embed.setImage(banner);
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel('Rules').setEmoji('📜').setStyle(ButtonStyle.Link).setURL(`https://discord.com/channels/${member.guild.id}/${member.guild.rulesChannelId || ch.id}`),
          new ButtonBuilder().setLabel('Introduce Yourself').setEmoji('👋').setStyle(ButtonStyle.Link).setURL(`https://discord.com/channels/${member.guild.id}/${ch.id}`)
        );
        ch.send({ embeds: [embed], components: [row] }).catch(()=>{});
      }
    }
    if (gc.log_channel) {
      const lc = member.guild.channels.cache.get(gc.log_channel);
      if (lc) lc.send({ embeds: [new EmbedBuilder().setTitle('Member Joined').setDescription(`<@${member.id}> (${member.user.tag})`).setThumbnail(member.user.displayAvatarURL({ dynamic: true })).addFields({ name: 'Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }, { name: 'Count', value: member.guild.memberCount.toString(), inline: true }).setColor(config.successColor).setTimestamp()] }).catch(()=>{});
    }
  },
};
