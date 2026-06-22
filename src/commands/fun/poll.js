const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('poll').setDescription('Create poll').addStringOption(o => o.setName('question').setDescription('Poll question').setRequired(true)).addStringOption(o => o.setName('options').setDescription('Comma separated')),
  async execute(interaction) {
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    const options = interaction.options.getString('options') ? interaction.options.getString('options').split(',').map(o => o.trim()).slice(0, 10) : ['Yes', 'No'];
    const msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Poll: ${interaction.options.getString('question')}`).setDescription(options.map((o, i) => `${emojis[i]} ${o}`).join('\n')).setColor(config.infoColor).setFooter({ text: `By ${interaction.user.tag}` }).setTimestamp()], fetchReply: true });
    for (let i = 0; i < options.length; i++) await msg.react(emojis[i]);
  },
};
