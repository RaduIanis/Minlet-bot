const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('nuke').setDescription('Clone channel').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel') || interaction.channel;
    const newCh = await ch.clone();
    if (ch.id !== interaction.channel.id) await ch.delete();
    newCh.send({ embeds: [new EmbedBuilder().setDescription(`💣 Nuked: <#${newCh.id}>`).setColor(config.errorColor)] });
  },
};
