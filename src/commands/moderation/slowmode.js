const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('slowmode').setDescription('Set slowmode').addIntegerOption(o => o.setName('seconds').setDescription('Seconds (0=off)').setMinValue(0).setMaxValue(21600).setRequired(true)).addChannelOption(o => o.setName('channel').setDescription('Channel')).setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const s = interaction.options.getInteger('seconds');
    const ch = interaction.options.getChannel('channel') || interaction.channel;
    await ch.setRateLimitPerUser(s);
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(s > 0 ? `Slowmode **${s}s** in <#${ch.id}>` : `Slowmode disabled in <#${ch.id}>`).setColor(config.successColor)] });
  },
};
