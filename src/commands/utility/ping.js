const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Check latency'),
  async execute(interaction, client) {
    const sent = await interaction.reply({ embeds: [new EmbedBuilder().setDescription('Pinging...').setColor(config.infoColor)], fetchReply: true });
    const api = sent.createdTimestamp - interaction.createdTimestamp;
    interaction.editReply({ embeds: [new EmbedBuilder().setTitle('🏓 Pong!').addFields({ name: 'API', value: `\`${api}ms\``, inline: true }, { name: 'WebSocket', value: `\`${client.ws.ping}ms\``, inline: true }).setColor(api < 200 ? config.successColor : config.warnColor).setTimestamp()] });
  },
};
