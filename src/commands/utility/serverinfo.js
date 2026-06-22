const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Server info'),
  async execute(interaction) {
    const g = interaction.guild;
    await g.members.fetch();
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${g.name}`).setThumbnail(g.iconURL({ dynamic: true })).setColor(config.infoColor).addFields({ name: 'General', value: `**ID:** ${g.id}\n**Owner:** <@${g.ownerId}>\n**Created:** <t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true }, { name: 'Members', value: `**Total:** ${g.memberCount}\n**Bots:** ${g.members.cache.filter(m => m.user.bot).size}`, inline: true }, { name: 'Boosts', value: `${g.premiumSubscriptionCount || 0} (Level ${g.premiumTier})`, inline: true }).setTimestamp()] });
  },
};
