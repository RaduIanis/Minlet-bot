const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('rules-embed').setDescription('Send rules embed').addChannelOption(o => o.setName('channel').setDescription('Channel to send rules to')).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const ch = interaction.options.getChannel('channel') || interaction.channel;
    const rules = ['Be respectful to all members.', 'No spamming or self-promotion.', 'Keep conversations in the right channels.', 'No NSFW or inappropriate content.', 'Follow Discord Terms of Service.', 'Listen to staff at all times.', 'Have fun!'];
    await ch.send({ embeds: [new EmbedBuilder().setTitle('Server Rules').setDescription(rules.map((r, i) => `> **${i+1}.** ${r}`).join('\n')).setColor('#ed4245').setFooter({ text: 'By being here you agree to these rules.' }).setTimestamp()] });
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Sent to <#${ch.id}>.`).setColor(config.successColor)], flags: 64 });
  },
};
