const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('remind').setDescription('Set reminder').addStringOption(o => o.setName('time').setDescription('e.g. 10m, 1h').setRequired(true)).addStringOption(o => o.setName('message').setDescription('Reminder message').setRequired(true)),
  async execute(interaction) {
    const dur = interaction.options.getString('time');
    const match = dur.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Invalid time. Use 10m, 1h, 1d.').setColor(config.errorColor)], flags: 64 });
    const ms = parseInt(match[1]) * { s: 1000, m: 60000, h: 3600000, d: 86400000 }[match[2]];
    db.prepare("INSERT INTO reminder (user_id, channel_id, content, remind_at) VALUES (?, ?, ?, datetime('now', ? || ' seconds'))").run(interaction.user.id, interaction.channel.id, interaction.options.getString('message'), Math.floor(ms / 1000));
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`⏰ Reminder set for **${dur}**.`).setColor(config.successColor)] });
  },
};
