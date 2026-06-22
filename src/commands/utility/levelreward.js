const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('levelreward').setDescription('Level rewards').addSubcommand(s => s.setName('add').setDescription('Add a level reward').addIntegerOption(o => o.setName('level').setDescription('Level number').setRequired(true).setMinValue(1)).addRoleOption(o => o.setName('role').setDescription('Role to award').setRequired(true))).addSubcommand(s => s.setName('remove').setDescription('Remove a level reward').addIntegerOption(o => o.setName('level').setDescription('Level to remove').setRequired(true))).addSubcommand(s => s.setName('list').setDescription('List all rewards')).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    let embed;
    if (sub === 'add') { const l = interaction.options.getInteger('level'); const r = interaction.options.getRole('role'); db.prepare('INSERT OR REPLACE INTO level_rewards (guild_id, level, role_id) VALUES (?, ?, ?)').run(interaction.guild.id, l, r.id); embed = new EmbedBuilder().setDescription(`Level **${l}** -> <@&${r.id}>`).setColor(config.successColor); }
    else if (sub === 'remove') { db.prepare('DELETE FROM level_rewards WHERE guild_id = ? AND level = ?').run(interaction.guild.id, interaction.options.getInteger('level')); embed = new EmbedBuilder().setDescription('Removed.').setColor(config.successColor); }
    else { const r = db.prepare('SELECT * FROM level_rewards WHERE guild_id = ? ORDER BY level').all(interaction.guild.id); embed = r.length ? new EmbedBuilder().setTitle('Rewards').setDescription(r.map(x => `Level **${x.level}** -> <@&${x.role_id}>`).join('\n')).setColor(config.infoColor) : new EmbedBuilder().setDescription('None.').setColor(config.warnColor); }
    interaction.reply({ embeds: [embed] });
  },
};
