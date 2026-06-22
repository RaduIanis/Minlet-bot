const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
module.exports = {
  data: new SlashCommandBuilder().setName('rps').setDescription('Rock Paper Scissors').addStringOption(o => o.setName('choice').setDescription('Your choice').addChoices({ name: 'Rock', value: 'rock' }, { name: 'Paper', value: 'paper' }, { name: 'Scissors', value: 'scissors' }).setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getString('choice');
    const bot = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
    const win = (user === 'rock' && bot === 'scissors') || (user === 'paper' && bot === 'rock') || (user === 'scissors' && bot === 'paper');
    interaction.reply({ embeds: [new EmbedBuilder().setTitle('RPS').addFields({ name: 'You', value: `${emojis[user]} ${user}`, inline: true }, { name: 'Bot', value: `${emojis[bot]} ${bot}`, inline: true }, { name: 'Result', value: user === bot ? "Tie!" : win ? 'You win!' : 'You lose!' }).setColor(win ? config.successColor : config.errorColor).setTimestamp()] });
  },
};
