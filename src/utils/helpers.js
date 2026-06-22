const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require('../config');

function xpForLevel(level) { return 5 * (level * level) + 50 * level + 100; }
function progressBar(current, max, length = 20) {
  const filled = Math.round((current / max) * length);
  return '`[' + '█'.repeat(filled) + '░'.repeat(length - filled) + ']`';
}

module.exports = { xpForLevel, progressBar, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType };
