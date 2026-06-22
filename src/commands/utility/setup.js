const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('setup').setDescription('Configure bot').addSubcommand(s => s.setName('welcome').setDescription('Set welcome channel').addChannelOption(o => o.setName('channel').setDescription('Welcome channel').addChannelTypes(ChannelType.GuildText).setRequired(true)).addStringOption(o => o.setName('message').setDescription('Welcome message'))).addSubcommand(s => s.setName('farewell').setDescription('Set farewell channel').addChannelOption(o => o.setName('channel').setDescription('Farewell channel').addChannelTypes(ChannelType.GuildText).setRequired(true)).addStringOption(o => o.setName('message').setDescription('Farewell message'))).addSubcommand(s => s.setName('autorole').setDescription('Set auto-role').addRoleOption(o => o.setName('role').setDescription('Role to assign').setRequired(true))).addSubcommand(s => s.setName('log').setDescription('Set log channel').addChannelOption(o => o.setName('channel').setDescription('Log channel').addChannelTypes(ChannelType.GuildText).setRequired(true))).addSubcommand(s => s.setName('mute').setDescription('Set mute role').addRoleOption(o => o.setName('role').setDescription('Mute role').setRequired(true))).addSubcommand(s => s.setName('levelup').setDescription('Set level-up channel').addChannelOption(o => o.setName('channel').setDescription('Level-up channel').addChannelTypes(ChannelType.GuildText).setRequired(true))).addSubcommand(s => s.setName('reset').setDescription('Reset all config')).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    db.prepare('INSERT OR IGNORE INTO guild_config (guild_id) VALUES (?)').run(interaction.guild.id);
    let embed;
    switch (sub) {
      case 'welcome': { const ch = interaction.options.getChannel('channel'); db.prepare('UPDATE guild_config SET welcome_channel = ?, welcome_message = ? WHERE guild_id = ?').run(ch.id, interaction.options.getString('message') || 'Welcome {user}!', interaction.guild.id); embed = new EmbedBuilder().setDescription(`Welcome set to <#${ch.id}>`).setColor(config.successColor); break; }
      case 'farewell': { const ch = interaction.options.getChannel('channel'); db.prepare('UPDATE guild_config SET farewell_channel = ?, farewell_message = ? WHERE guild_id = ?').run(ch.id, interaction.options.getString('message') || '{user} has left.', interaction.guild.id); embed = new EmbedBuilder().setDescription(`Farewell set to <#${ch.id}>`).setColor(config.successColor); break; }
      case 'autorole': { const r = interaction.options.getRole('role'); db.prepare('UPDATE guild_config SET autorole = ? WHERE guild_id = ?').run(r.id, interaction.guild.id); embed = new EmbedBuilder().setDescription(`Auto-role set to <@&${r.id}>`).setColor(config.successColor); break; }
      case 'log': { const ch = interaction.options.getChannel('channel'); db.prepare('UPDATE guild_config SET log_channel = ? WHERE guild_id = ?').run(ch.id, interaction.guild.id); embed = new EmbedBuilder().setDescription(`Logs set to <#${ch.id}>`).setColor(config.successColor); break; }
      case 'mute': { const r = interaction.options.getRole('role'); db.prepare('UPDATE guild_config SET mute_role = ? WHERE guild_id = ?').run(r.id, interaction.guild.id); embed = new EmbedBuilder().setDescription(`Mute role set to <@&${r.id}>`).setColor(config.successColor); break; }
      case 'levelup': { const ch = interaction.options.getChannel('channel'); db.prepare('UPDATE guild_config SET level_channel = ? WHERE guild_id = ?').run(ch.id, interaction.guild.id); embed = new EmbedBuilder().setDescription(`Level-up set to <#${ch.id}>`).setColor(config.successColor); break; }
      case 'reset': { db.prepare('DELETE FROM guild_config WHERE guild_id = ?').run(interaction.guild.id); embed = new EmbedBuilder().setDescription('Reset.').setColor(config.successColor); break; }
    }
    interaction.reply({ embeds: [embed] });
  },
};
