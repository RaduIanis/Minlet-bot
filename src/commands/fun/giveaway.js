const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('giveaway').setDescription('Giveaways').addSubcommand(s => s.setName('start').setDescription('Start a giveaway').addStringOption(o => o.setName('prize').setDescription('Prize to give away').setRequired(true)).addStringOption(o => o.setName('duration').setDescription('Duration e.g. 1h, 1d').setRequired(true)).addIntegerOption(o => o.setName('winners').setDescription('Number of winners').setMinValue(1).setMaxValue(20)).addStringOption(o => o.setName('description').setDescription('Extra description'))).addSubcommand(s => s.setName('reroll').setDescription('Reroll a giveaway').addStringOption(o => o.setName('message_id').setDescription('Message ID to reroll').setRequired(true))).addSubcommand(s => s.setName('end').setDescription('End a giveaway early').addStringOption(o => o.setName('message_id').setDescription('Message ID to end').setRequired(true))).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'start') {
      const prize = interaction.options.getString('prize');
      const dur = interaction.options.getString('duration');
      const winners = interaction.options.getInteger('winners') || 1;
      const desc = interaction.options.getString('description') || '';
      const match = dur.match(/^(\d+)(s|m|h|d|w)$/);
      if (!match) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Invalid duration.').setColor(config.errorColor)], flags: 64 });
      const ms = parseInt(match[1]) * { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 }[match[2]];
      const end = Math.floor((Date.now() + ms) / 1000);
      const embed = new EmbedBuilder().setTitle(`Giveaway: ${prize}`).setDescription((desc ? desc + '\n\n' : '') + `**Ends:** <t:${end}:R>\n**Host:** <@${interaction.user.id}>\n**Winners:** ${winners}\n\nReact with \u{1f389} to enter!`).setColor(config.gameColor).setTimestamp(new Date(Date.now() + ms));
      const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('giveaway_enter').setLabel('Enter').setEmoji('\u{1f389}').setStyle(ButtonStyle.Success));
      const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
      await msg.react('\u{1f389}');
      setTimeout(async () => {
        try {
          const fresh = await interaction.channel.messages.fetch(msg.id).catch(() => null);
          if (!fresh) return;
          const reaction = fresh.reactions.cache.get('\u{1f389}');
          if (!reaction) return;
          const users = await reaction.users.fetch();
          const entrants = users.filter(u => !u.bot).map(u => u.id);
          if (!entrants.length) { await fresh.edit({ embeds: [new EmbedBuilder().setTitle(`Giveaway: ${prize}`).setDescription('No entries.').setColor(config.warnColor)], components: [] }); return; }
          const selected = entrants.sort(() => 0.5 - Math.random()).slice(0, Math.min(winners, entrants.length));
          await fresh.edit({ embeds: [new EmbedBuilder().setTitle(`Giveaway: ${prize}`).setDescription(`**Winner(s):** ${selected.map(id => `<@${id}>`).join(', ')}\n\n\u{1f389} Congratulations!`).setColor(config.successColor).setTimestamp()], components: [] });
          await fresh.reply(`\u{1f389} ${selected.map(id => `<@${id}>`).join(', ')} won **${prize}**!`);
        } catch(e) { console.error(e); }
      }, ms);
      interaction.followUp({ embeds: [new EmbedBuilder().setDescription(`Giveaway started! Ends <t:${end}:R>`).setColor(config.successColor)], flags: 64 });
    } else if (sub === 'reroll') {
      try {
        const msg = await interaction.channel.messages.fetch(interaction.options.getString('message_id'));
        const reaction = msg.reactions.cache.get('\u{1f389}');
        if (!reaction) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('No reactions.').setColor(config.errorColor)], flags: 64 });
        const users = await reaction.users.fetch();
        const entrants = users.filter(u => !u.bot).map(u => u.id);
        if (!entrants.length) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('No entries.').setColor(config.errorColor)], flags: 64 });
        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`\u{1f389} New winner: <@${entrants[Math.floor(Math.random() * entrants.length)]}>!`).setColor(config.successColor)] });
      } catch { interaction.reply({ embeds: [new EmbedBuilder().setDescription('Message not found.').setColor(config.errorColor)], flags: 64 }); }
    } else {
      try {
        const msg = await interaction.channel.messages.fetch(interaction.options.getString('message_id'));
        const reaction = msg.reactions.cache.get('\u{1f389}');
        if (!reaction) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('No reactions.').setColor(config.errorColor)], flags: 64 });
        const users = await reaction.users.fetch();
        const entrants = users.filter(u => !u.bot).map(u => u.id);
        if (!entrants.length) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('No entries.').setColor(config.errorColor)], flags: 64 });
        const winner = entrants[Math.floor(Math.random() * entrants.length)];
        await msg.edit({ embeds: [new EmbedBuilder().setTitle(msg.embeds[0]?.title).setDescription(`**Winner:** <@${winner}>\n\n\u{1f389} Congratulations!`).setColor(config.successColor).setTimestamp()], components: [] });
        await msg.reply(`\u{1f389} <@${winner}> won!`);
        interaction.reply({ embeds: [new EmbedBuilder().setDescription('Ended!').setColor(config.successColor)], flags: 64 });
      } catch { interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not found.').setColor(config.errorColor)], flags: 64 }); }
    }
  },
};
