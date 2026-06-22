const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
const catMap = { ticket_category_support: { name: 'Support', emoji: '🛠️', color: '#5865f2' }, ticket_category_partner: { name: 'Partnership', emoji: '🤝', color: '#57f287' }, ticket_category_report: { name: 'Report', emoji: '⚠️', color: '#ed4245' }, ticket_category_other: { name: 'Other', emoji: '📝', color: '#fee75c' } };
module.exports = {
  name: 'ticket_category',
  async execute(interaction, client) {
    const info = catMap[interaction.customId];
    if (!info) return;
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(interaction.guild.id);
    if (!gc?.ticket_category) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not configured.').setColor(config.errorColor)], flags: 64 });
    const ex = db.prepare("SELECT * FROM tickets WHERE guild_id = ? AND creator_id = ? AND status = 'open'").get(interaction.guild.id, interaction.user.id);
    if (ex) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Open ticket: <#${ex.channel_id}>`).setColor(config.warnColor)], flags: 64 });
    await interaction.deferReply({ ephemeral: true });
    const num = db.prepare('SELECT COUNT(*) as c FROM tickets WHERE guild_id = ?').get(interaction.guild.id).c + 1;
    const channel = await interaction.guild.channels.create({ name: `${info.name.toLowerCase()}-${num}`, type: ChannelType.GuildText, parent: gc.ticket_category, permissionOverwrites: [{ id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] }, { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }, { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels] }] });
    db.prepare("INSERT INTO tickets (guild_id, channel_id, creator_id, category) VALUES (?, ?, ?, ?)").run(interaction.guild.id, channel.id, interaction.user.id, info.name.toLowerCase());
    const embed = new EmbedBuilder().setTitle(`${info.emoji} ${info.name} Ticket #${num}`).setDescription(`Welcome <@${interaction.user.id}>, you opened a **${info.name}** ticket.\n\nDescribe your request and staff will assist you.`).addFields({ name: 'Ticket', value: `#${num}`, inline: true }, { name: 'Category', value: `${info.emoji} ${info.name}`, inline: true }, { name: 'Status', value: '🟢 Open', inline: true }).setColor(info.color).setFooter({ text: `Ticket #${num}` }).setTimestamp();
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('ticket_close').setLabel('Close').setEmoji('🔒').setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId('ticket_claim').setLabel('Claim').setEmoji('🙋').setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId('ticket_transcript').setLabel('Transcript').setEmoji('📄').setStyle(ButtonStyle.Secondary));
    await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });
    const staff = interaction.guild.roles.cache.find(r => r.name.toLowerCase().includes('staff') || r.name.toLowerCase().includes('support'));
    if (staff) await channel.send({ content: `${staff} — New ${info.name.toLowerCase()} ticket!` });
    interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`${info.emoji} **${info.name}** ticket created: <#${channel.id}>`).setColor(config.successColor)] });
  },
};
