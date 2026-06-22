const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('membercount').setDescription('Member count'),
  async execute(interaction) {
    const g = interaction.guild;
    await g.members.fetch();
    const bots = g.members.cache.filter(m => m.user.bot).size;
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${g.name}`).addFields({ name: 'Total', value: g.memberCount.toString(), inline: true }, { name: 'Humans', value: (g.memberCount - bots).toString(), inline: true }, { name: 'Bots', value: bots.toString(), inline: true }).setColor(config.infoColor).setTimestamp()] });
  },
};
