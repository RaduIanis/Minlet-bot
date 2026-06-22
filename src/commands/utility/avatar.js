const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('avatar').setDescription('Get avatar').addUserOption(o => o.setName('user').setDescription('User')),
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('PNG').setURL(target.displayAvatarURL({ extension: 'png', size: 1024 })).setStyle(ButtonStyle.Link), new ButtonBuilder().setLabel('JPG').setURL(target.displayAvatarURL({ extension: 'jpg', size: 1024 })).setStyle(ButtonStyle.Link), new ButtonBuilder().setLabel('WEBP').setURL(target.displayAvatarURL({ extension: 'webp', size: 1024 })).setStyle(ButtonStyle.Link));
    interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${target.tag}'s Avatar`).setImage(target.displayAvatarURL({ dynamic: true, size: 1024 })).setColor(config.infoColor)], components: [row] });
  },
};
