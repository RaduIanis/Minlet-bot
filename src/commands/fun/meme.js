const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('meme').setDescription('Programming meme'),
  async execute(interaction) { const m = ['Why do programmers prefer dark mode? Light attracts bugs.', 'A SQL query walks into a bar: "Can I join you?"', "Why do Java devs wear glasses? Because they can't C#.", 'How many programmers to change a light bulb? None — hardware problem.']; interaction.reply({ embeds: [new EmbedBuilder().setTitle('Meme').setDescription(m[Math.floor(Math.random() * m.length)]).setColor(config.gameColor).setTimestamp()] }); },
};
