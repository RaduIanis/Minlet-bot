const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo-embed').setDescription('Send server info embed').addChannelOption(o => o.setName('channel').setDescription('Channel')).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel') || interaction.channel;
    const g = interaction.guild;
    const embed = new EmbedBuilder().setTitle('Minlet Free Host').setDescription('Free game hosting for everyone.').setThumbnail(g.iconURL({ dynamic: true, size: 256 })).setColor(config.infoColor).setTimestamp();
    await ch.send({ embeds: [embed] });
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Sent to <#${ch.id}>.`).setColor(config.successColor)], flags: 64 });
  },
};
