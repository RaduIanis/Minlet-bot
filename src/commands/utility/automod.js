const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('automod').setDescription('Auto-mod').addSubcommand(s => s.setName('antispan').setDescription('Toggle anti-spam').addBooleanOption(o => o.setName('enabled').setDescription('Enable or disable').setRequired(true))).addSubcommand(s => s.setName('antilink').setDescription('Toggle anti-link').addBooleanOption(o => o.setName('enabled').setDescription('Enable or disable').setRequired(true))).addSubcommand(s => s.setName('antimention').setDescription('Toggle anti-mention').addBooleanOption(o => o.setName('enabled').setDescription('Enable or disable').setRequired(true))).addSubcommand(s => s.setName('status').setDescription('View automod status')).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    db.prepare('INSERT OR IGNORE INTO guild_config (guild_id) VALUES (?)').run(interaction.guild.id);
    let embed;
    const sub = interaction.options.getSubcommand();
    if (sub === 'status') { const c = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(interaction.guild.id); embed = new EmbedBuilder().addFields({ name: 'Anti-Spam', value: c?.anti_spam ? 'Yes' : 'No', inline: true }, { name: 'Anti-Link', value: c?.anti_link ? 'Yes' : 'No', inline: true }, { name: 'Anti-Mention', value: c?.anti_mass_mention ? 'Yes' : 'No', inline: true }).setColor(config.infoColor); }
    else { const on = interaction.options.getBoolean('enabled'); const col = sub === 'antispan' ? 'anti_spam' : sub === 'antilink' ? 'anti_link' : 'anti_mass_mention'; db.prepare(`UPDATE guild_config SET ${col} = ? WHERE guild_id = ?`).run(on ? 1 : 0, interaction.guild.id); embed = new EmbedBuilder().setDescription(`${sub} ${on ? 'enabled' : 'disabled'}.`).setColor(on ? config.successColor : config.warnColor); }
    interaction.reply({ embeds: [embed] });
  },
};
