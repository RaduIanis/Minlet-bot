const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('reactionrole').setDescription('Reaction roles').addSubcommand(s => s.setName('create').setDescription('Create a reaction role message').addStringOption(o => o.setName('title').setDescription('Embed title').setRequired(true)).addStringOption(o => o.setName('description').setDescription('Embed description').setRequired(true)).addStringOption(o => o.setName('roles').setDescription('RoleID:Emoji,...').setRequired(true))).addSubcommand(s => s.setName('list').setDescription('List reaction roles')).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'list') { const rr = db.prepare('SELECT reaction_roles FROM guild_config WHERE guild_id = ?').get(interaction.guild.id); const rrs = JSON.parse(rr?.reaction_roles || '[]'); return interaction.reply({ embeds: [new EmbedBuilder().setDescription(rrs.length ? rrs.map((r, i) => `**${i+1}.** <#${r.channelId}>`).join('\n') : 'None.').setColor(config.infoColor)] }); }
    const pairs = interaction.options.getString('roles').split(',').map(p => { const [id, emoji] = p.split(':'); return { roleId: id?.trim(), emoji: emoji?.trim() }; });
    if (pairs.some(p => !p.roleId || !p.emoji)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Invalid format.').setColor(config.errorColor)], flags: 64 });
    const options = pairs.map(p => new StringSelectMenuOptionBuilder().setLabel(`Role ${p.roleId}`).setValue(p.roleId).setEmoji(p.emoji));
    const menu = new StringSelectMenuBuilder().setCustomId('reactionrole_select').setPlaceholder('Select a role').setMinValues(1).setMaxValues(1).addOptions(options);
    const msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle(interaction.options.getString('title')).setDescription(interaction.options.getString('description')).setColor(config.infoColor)], components: [new ActionRowBuilder().addComponents(menu)], fetchReply: true });
    const rrConfig = db.prepare('SELECT reaction_roles FROM guild_config WHERE guild_id = ?').get(interaction.guild.id);
    const existing = JSON.parse(rrConfig?.reaction_roles || '[]');
    existing.push({ messageId: msg.id, channelId: interaction.channel.id, roles: pairs });
    db.prepare('UPDATE guild_config SET reaction_roles = ? WHERE guild_id = ?').run(JSON.stringify(existing), interaction.guild.id);
  },
};
