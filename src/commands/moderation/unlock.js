const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('unlock').setDescription('Unlock a channel').addChannelOption(o => o.setName('channel').setDescription('Channel')).setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel') || interaction.channel;
    await ch.permissionOverwrites.edit(interaction.guild.id, { SendMessages: null });
    interaction.reply({ embeds: [new EmbedBuilder().setTitle('🔓 Unlocked').setDescription(`<#${ch.id}> unlocked.`).setColor(config.successColor)] });
  },
};
