const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('note').setDescription('Add note').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('content').setDescription('Content').setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const t = interaction.options.getUser('user');
    db.prepare('INSERT INTO notes (guild_id, user_id, moderator_id, content) VALUES (?, ?, ?, ?)').run(interaction.guild.id, t.id, interaction.user.id, interaction.options.getString('content'));
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Note added to **${t.tag}**.`).setColor(config.successColor)] });
  },
};
