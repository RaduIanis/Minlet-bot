const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../../database/schema');
const config = require('../../config');
module.exports = {
  data: new SlashCommandBuilder().setName('game').setDescription('Game hosting').addSubcommand(s => s.setName('create').setDescription('Create a new game lobby').addStringOption(o => o.setName('name').setDescription('Game name').setRequired(true)).addIntegerOption(o => o.setName('players').setDescription('Max players').setMinValue(2).setMaxValue(100)).addStringOption(o => o.setName('description').setDescription('Game description')).addStringOption(o => o.setName('time').setDescription('Scheduled time'))).addSubcommand(s => s.setName('join').setDescription('Join a game').addIntegerOption(o => o.setName('id').setDescription('Game ID').setRequired(true))).addSubcommand(s => s.setName('leave').setDescription('Leave a game').addIntegerOption(o => o.setName('id').setDescription('Game ID').setRequired(true))).addSubcommand(s => s.setName('start').setDescription('Start a game (host only)').addIntegerOption(o => o.setName('id').setDescription('Game ID').setRequired(true))).addSubcommand(s => s.setName('end').setDescription('End a game (host only)').addIntegerOption(o => o.setName('id').setDescription('Game ID').setRequired(true))).addSubcommand(s => s.setName('list').setDescription('List active games')).addSubcommand(s => s.setName('info').setDescription('View game info').addIntegerOption(o => o.setName('id').setDescription('Game ID').setRequired(true))).addSubcommand(s => s.setName('kick').setDescription('Kick a player (host only)').addIntegerOption(o => o.setName('id').setDescription('Game ID').setRequired(true)).addUserOption(o => o.setName('user').setDescription('Player to kick').setRequired(true))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'create') {
      const name = interaction.options.getString('name');
      const max = interaction.options.getInteger('players') || 4;
      const desc = interaction.options.getString('description') || 'No description';
      const time = interaction.options.getString('time') || 'ASAP';
      const r = db.prepare("INSERT INTO games (guild_id, host_id, channel_id, game_name, max_players, description, scheduled_time) VALUES (?, ?, ?, ?, ?, ?, ?)").run(interaction.guild.id, interaction.user.id, interaction.channel.id, name, max, desc, time);
      const id = r.lastInsertRowid;
      const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`game_join_${id}`).setLabel('Join').setEmoji('\u{1f3ae}').setStyle(ButtonStyle.Success));
      const msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle('Game Created').setDescription(`**${name}**`).addFields({ name: 'Host', value: `<@${interaction.user.id}>`, inline: true }, { name: 'Players', value: `1/${max}`, inline: true }, { name: 'Time', value: time, inline: true }, { name: 'ID', value: id.toString(), inline: true }).setColor(config.gameColor).setTimestamp()], components: [row], fetchReply: true });
      db.prepare('UPDATE games SET message_id = ? WHERE id = ?').run(msg.id, id);
    } else if (sub === 'join') {
      const id = interaction.options.getInteger('id');
      const g = db.prepare('SELECT * FROM games WHERE id = ? AND guild_id = ?').get(id, interaction.guild.id);
      if (!g) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not found.').setColor(config.errorColor)], flags: 64 });
      if (g.status !== 'waiting') return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Already started.').setColor(config.errorColor)], flags: 64 });
      const p = JSON.parse(g.current_players || '[]');
      if (p.includes(interaction.user.id)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Already joined.').setColor(config.warnColor)], flags: 64 });
      if (p.length >= g.max_players) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Full.').setColor(config.errorColor)], flags: 64 });
      p.push(interaction.user.id);
      db.prepare('UPDATE games SET current_players = ? WHERE id = ?').run(JSON.stringify(p), id);
      interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Joined **${g.game_name}**! (${p.length}/${g.max_players})`).setColor(config.successColor)] });
    } else if (sub === 'leave') {
      const id = interaction.options.getInteger('id');
      const g = db.prepare('SELECT * FROM games WHERE id = ? AND guild_id = ?').get(id, interaction.guild.id);
      if (!g) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not found.').setColor(config.errorColor)], flags: 64 });
      const p = JSON.parse(g.current_players || '[]');
      const i = p.indexOf(interaction.user.id);
      if (i === -1) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not in game.').setColor(config.warnColor)], flags: 64 });
      p.splice(i, 1);
      db.prepare('UPDATE games SET current_players = ? WHERE id = ?').run(JSON.stringify(p), id);
      interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Left **${g.game_name}**.`).setColor(config.infoColor)] });
    } else if (sub === 'start') {
      const id = interaction.options.getInteger('id');
      const g = db.prepare('SELECT * FROM games WHERE id = ? AND guild_id = ?').get(id, interaction.guild.id);
      if (!g) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not found.').setColor(config.errorColor)], flags: 64 });
      if (g.host_id !== interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Host only.').setColor(config.errorColor)], flags: 64 });
      db.prepare("UPDATE games SET status = 'active', started_at = datetime('now') WHERE id = ?").run(id);
      const p = JSON.parse(g.current_players || '[]');
      interaction.reply({ embeds: [new EmbedBuilder().setTitle('Game Started!').setDescription(`**${g.game_name}**`).addFields({ name: 'Players', value: p.map(x => `<@${x}>`).join(', ') || 'None' }).setColor(config.gameColor)] });
    } else if (sub === 'end') {
      const id = interaction.options.getInteger('id');
      const g = db.prepare('SELECT * FROM games WHERE id = ? AND guild_id = ?').get(id, interaction.guild.id);
      if (!g) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not found.').setColor(config.errorColor)], flags: 64 });
      if (g.host_id !== interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Host only.').setColor(config.errorColor)], flags: 64 });
      db.prepare("UPDATE games SET status = 'ended', ended_at = datetime('now') WHERE id = ?").run(id);
      interaction.reply({ embeds: [new EmbedBuilder().setDescription(`**${g.game_name}** ended.`).setColor(config.warnColor)] });
    } else if (sub === 'list') {
      const games = db.prepare("SELECT * FROM games WHERE guild_id = ? AND (status = 'waiting' OR status = 'active') ORDER BY created_at DESC").all(interaction.guild.id);
      if (!games.length) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('No games.').setColor(config.warnColor)], flags: 64 });
      interaction.reply({ embeds: [new EmbedBuilder().setTitle('Active Games').setDescription(games.map(g => { const p = JSON.parse(g.current_players || '[]'); return `**#${g.id}** — ${g.game_name} | <@${g.host_id}> | ${p.length}/${g.max_players} | ${g.status}`; }).join('\n')).setColor(config.gameColor).setTimestamp()] });
    } else if (sub === 'info') {
      const id = interaction.options.getInteger('id');
      const g = db.prepare('SELECT * FROM games WHERE id = ? AND guild_id = ?').get(id, interaction.guild.id);
      if (!g) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not found.').setColor(config.errorColor)], flags: 64 });
      const p = JSON.parse(g.current_players || '[]');
      interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${g.game_name}`).addFields({ name: 'Host', value: `<@${g.host_id}>`, inline: true }, { name: 'Status', value: g.status, inline: true }, { name: 'Players', value: `${p.length}/${g.max_players}`, inline: true }, { name: 'Description', value: g.description || 'None' }, { name: 'Player List', value: p.length ? p.map(x => `<@${x}>`).join(', ') : 'None' }).setColor(config.gameColor).setTimestamp()] });
    } else if (sub === 'kick') {
      const id = interaction.options.getInteger('id');
      const target = interaction.options.getUser('user');
      const g = db.prepare('SELECT * FROM games WHERE id = ? AND guild_id = ?').get(id, interaction.guild.id);
      if (!g) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not found.').setColor(config.errorColor)], flags: 64 });
      if (g.host_id !== interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Host only.').setColor(config.errorColor)], flags: 64 });
      const p = JSON.parse(g.current_players || '[]');
      const i = p.indexOf(target.id);
      if (i === -1) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Not in game.').setColor(config.warnColor)], flags: 64 });
      p.splice(i, 1);
      db.prepare('UPDATE games SET current_players = ? WHERE id = ?').run(JSON.stringify(p), id);
      interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<@${target.id}> kicked.`).setColor(config.warnColor)] });
    }
  },
};
