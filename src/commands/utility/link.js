const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('link').setDescription('Add links to the server info embed').addChannelOption(o => o.setName('channel').setDescription('Channel').setRequired(true)).addStringOption(o => o.setName('link1_name').setDescription('Link 1 name')).addStringOption(o => o.setName('link1_url').setDescription('Link 1 URL')).addStringOption(o => o.setName('link2_name').setDescription('Link 2 name')).addStringOption(o => o.setName('link2_url').setDescription('Link 2 URL')).addStringOption(o => o.setName('link3_name').setDescription('Link 3 name')).addStringOption(o => o.setName('link3_url').setDescription('Link 3 URL')).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel');
    const buttons = [];
    for (let i = 1; i <= 3; i++) {
      const name = interaction.options.getString(`link${i}_name`);
      const url = interaction.options.getString(`link${i}_url`);
      if (name && url) buttons.push(new ButtonBuilder().setLabel(name).setURL(url).setStyle(ButtonStyle.Link));
    }
    if (!buttons.length) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Add at least one link.').setColor(config.errorColor)], flags: 64 });
    const row = new ActionRowBuilder().addComponents(buttons);
    await ch.send({ components: [row] });
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Links sent to <#${ch.id}>.`).setColor(config.successColor)], flags: 64 });
  },
};
