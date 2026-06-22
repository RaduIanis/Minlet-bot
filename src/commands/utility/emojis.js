const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('emojis').setDescription('List emojis'),
  async execute(interaction) {
    const e = interaction.guild.emojis.cache;
    if (!e.size) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('No emojis.').setColor(config.warnColor)], flags: 64 });
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Emojis — ${interaction.guild.name}`).setDescription(e.map(x => `${x}`).join(' ')).setColor(config.infoColor).setFooter({ text: `${e.size} emojis` }).setTimestamp()] });
  },
};
