const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('All commands').addStringOption(o => o.setName('command').setDescription('Specific command')),
  async execute(interaction, client) {
    const specific = interaction.options.getString('command');
    if (specific) { const cmd = client.commands.get(specific); if (!cmd) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`\`${specific}\` not found.`).setColor(config.errorColor)], flags: 64 }); return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`/${cmd.data.name}`).setDescription(cmd.data.description).setColor(config.infoColor)] }); }
    const cats = {};
    client.commands.forEach(c => { const cat = c.category || 'other'; if (!cats[cat]) cats[cat] = []; cats[cat].push(c); });
    const emojis = { moderation: '🔨', utility: '🛠️', fun: '🎮', gamehosting: '🎯' };
    const embed = new EmbedBuilder().setTitle('Minlet Bot — Commands').setDescription('Use `/help command:<name>` for details.').setColor(config.infoColor).setThumbnail(client.user.displayAvatarURL({ dynamic: true })).setFooter({ text: `${client.commands.size} commands` }).setTimestamp();
    for (const [cat, cmds] of Object.entries(cats)) embed.addFields({ name: `${emojis[cat] || '📁'} ${cat}`, value: cmds.map(c => `\`${c.data.name}\``).join(', ') });
    interaction.reply({ embeds: [embed] });
  },
};
