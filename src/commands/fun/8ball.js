const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const responses = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes, definitely.', 'You may rely on it.', 'Most likely.', 'Yes.', 'Reply hazy, try again.', 'Cannot predict now.', "Don't count on it.", 'My reply is no.', 'Very doubtful.'];
module.exports = {
  data: new SlashCommandBuilder().setName('8ball').setDescription('Magic 8-ball').addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true)),
  async execute(interaction) { interaction.reply({ embeds: [new EmbedBuilder().setTitle('🎱 Magic 8-Ball').addFields({ name: 'Question', value: interaction.options.getString('question') }, { name: 'Answer', value: responses[Math.floor(Math.random() * responses.length)] }).setColor('#9b59b6').setTimestamp()] }); },
};
