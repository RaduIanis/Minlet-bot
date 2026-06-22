const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('ticket').setDescription('Ticket commands').addSubcommand(s => s.setName('setup').setDescription('Set up the ticket panel').addChannelOption(o => o.setName('channel').setDescription('Channel for the panel').addChannelTypes(ChannelType.GuildText).setRequired(true)).addChannelOption(o => o.setName('category').setDescription('Category for tickets').addChannelTypes(ChannelType.GuildCategory))).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Admin only.').setColor(config.errorColor)], flags: 64 });
    const channel = interaction.options.getChannel('channel');
    let category = interaction.options.getChannel('category');
    if (!category) { const existing = interaction.guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === 'TICKETS'); category = existing || await interaction.guild.channels.create({ name: 'TICKETS', type: ChannelType.GuildCategory }); }
    db.prepare('UPDATE guild_config SET ticket_category = ? WHERE guild_id = ?').run(category.id, interaction.guild.id);
    const embed = new EmbedBuilder().setTitle('Support Tickets').setDescription('Need help? Click below.').setColor(config.infoColor).setTimestamp();
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('ticket_create').setLabel('Open Ticket').setEmoji('\u{1f3ab}').setStyle(ButtonStyle.Primary));
    await channel.send({ embeds: [embed], components: [row] });
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Panel sent to <#${channel.id}> in **${category.name}**.`).setColor(config.successColor)], flags: 64 });
  },
};
