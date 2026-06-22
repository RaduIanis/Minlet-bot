const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('link').setDescription('Add link buttons to a message or send new ones').addChannelOption(o => o.setName('channel').setDescription('Channel').setRequired(true)).addStringOption(o => o.setName('link1_name').setDescription('Link 1 name')).addStringOption(o => o.setName('link1_url').setDescription('Link 1 URL')).addStringOption(o => o.setName('link2_name').setDescription('Link 2 name')).addStringOption(o => o.setName('link2_url').setDescription('Link 2 URL')).addStringOption(o => o.setName('link3_name').setDescription('Link 3 name')).addStringOption(o => o.setName('link3_url').setDescription('Link 3 URL')).addStringOption(o => o.setName('message_id').setDescription('Message ID to edit (optional)')).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
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
    const msgId = interaction.options.getString('message_id');
    if (msgId) {
      try {
        const msg = await ch.messages.fetch(msgId);
        const existing = msg.components[0]?.components || [];
        const allButtons = [...existing.map(c => ButtonBuilder.from(c)), ...buttons];
        if (allButtons.length > 5) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Max 5 buttons per row.').setColor(config.errorColor)], flags: 64 });
        await msg.edit({ components: [new ActionRowBuilder().addComponents(allButtons)] });
        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Links added to [message](https://discord.com/channels/${interaction.guild.id}/${ch.id}/${msgId}).`).setColor(config.successColor)], flags: 64 });
      } catch { return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Message not found.').setColor(config.errorColor)], flags: 64 }); }
    } else {
      await ch.send({ components: [row] });
      interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Links sent to <#${ch.id}>.`).setColor(config.successColor)], flags: 64 });
    }
  },
};
