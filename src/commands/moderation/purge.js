const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('purge').setDescription('Bulk delete messages').addIntegerOption(o => o.setName('amount').setDescription('Amount (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)).addUserOption(o => o.setName('user').setDescription('Only this user')).setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const user = interaction.options.getUser('user');
    await interaction.deferReply({ ephemeral: true });
    const msgs = await interaction.channel.messages.fetch({ limit: amount });
    const filtered = user ? msgs.filter(m => m.author.id === user.id) : msgs;
    const deleted = await interaction.channel.bulkDelete(filtered, true);
    interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Deleted **${deleted.size}** messages.`).setColor(config.successColor)] });
  },
};
