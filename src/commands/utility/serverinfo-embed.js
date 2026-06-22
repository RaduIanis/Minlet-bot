const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo-embed').setDescription('Send server info embed').addChannelOption(o => o.setName('channel').setDescription('Channel')).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel') || interaction.channel;
    const g = interaction.guild;
    const embed = new EmbedBuilder().setTitle('Minlet Free Host').setDescription('Free game hosting for everyone.').setThumbnail(g.iconURL({ dynamic: true, size: 256 })).setColor(config.infoColor).setTimestamp();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Discord').setURL('https://discord.gg/VWMPFcj4jj').setStyle(ButtonStyle.Link).setEmoji('\u{1f4ac}'),
      new ButtonBuilder().setLabel('Website').setURL('https://minlet.host/').setStyle(ButtonStyle.Link).setEmoji('\u{1f310}'),
      new ButtonBuilder().setLabel('Support').setURL('https://discord.com/channels/1518178485829369956/1518178487528194155').setStyle(ButtonStyle.Link).setEmoji('\u{1f527}'),
    );
    await ch.send({ embeds: [embed], components: [row] });
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Sent to <#${ch.id}>.`).setColor(config.successColor)], flags: 64 });
  },
};
