const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('announce').setDescription('Send announcement').addStringOption(o => o.setName('title').setDescription('Title').setRequired(true)).addStringOption(o => o.setName('message').setDescription('Message').setRequired(true)).addChannelOption(o => o.setName('channel').setDescription('Channel')).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel') || interaction.channel;
    await ch.send({ embeds: [new EmbedBuilder().setTitle(interaction.options.getString('title')).setDescription(interaction.options.getString('message')).setColor(config.infoColor).setFooter({ text: `By ${interaction.user.tag}` }).setTimestamp()] });
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Sent to <#${ch.id}>.`).setColor(config.successColor)], flags: 64 });
  },
};
