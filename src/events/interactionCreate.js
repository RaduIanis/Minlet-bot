const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../database/schema');
const config = require('../config');
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isModalSubmit()) {
      try {
        if (interaction.customId === 'ticket_add_modal') return await require('../systems/ticketAddModal').execute(interaction, client);
        if (interaction.customId === 'ticket_remove_modal') return await require('../systems/ticketRemoveModal').execute(interaction, client);
      } catch (e) { console.error(e); await interaction.reply({ embeds: [new EmbedBuilder().setDescription('Error.').setColor(config.errorColor)], flags: 64 }).catch(()=>{}); }
      return;
    }
    if (interaction.isButton()) {
      const id = interaction.customId;
      try {
        if (id === 'ticket_create') return await require('../systems/ticketCreate').execute(interaction, client);
        if (id.startsWith('ticket_category_')) return await require('../systems/ticketCategory').execute(interaction, client);
        if (id === 'ticket_close') return await require('../systems/ticketClose').execute(interaction, client);
        if (id === 'ticket_claim') return await require('../systems/ticketClaim').execute(interaction, client);
        if (id === 'ticket_transcript') return await require('../systems/ticketTranscript').execute(interaction, client);
        if (id === 'giveaway_enter') return await interaction.reply({ embeds: [new EmbedBuilder().setDescription('React with \u{1f389} to enter!').setColor(config.infoColor)], flags: 64 });
        if (id === 'reactionrole_select') return await require('../systems/reactionRole').execute(interaction, client);
        if (id === 'suggestion_up' || id === 'suggestion_down') {
          const s = db.prepare('SELECT * FROM suggestions WHERE message_id = ? AND guild_id = ?').get(interaction.message.id, interaction.guild.id);
          if (!s) return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Suggestion not found.').setColor(config.errorColor)], flags: 64 });
          const up = JSON.parse(s.upvotes || '[]');
          const down = JSON.parse(s.downvotes || '[]');
          const userId = interaction.user.id;
          if (id === 'suggestion_up') {
            if (up.includes(userId)) { up.splice(up.indexOf(userId), 1); }
            else { up.push(userId); down.splice(down.indexOf(userId), 1); }
          } else {
            if (down.includes(userId)) { down.splice(down.indexOf(userId), 1); }
            else { down.push(userId); up.splice(up.indexOf(userId), 1); }
          }
          db.prepare('UPDATE suggestions SET upvotes = ?, downvotes = ? WHERE message_id = ? AND guild_id = ?').run(JSON.stringify(up), JSON.stringify(down), interaction.message.id, interaction.guild.id);
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('suggestion_up').setLabel(String(up.length)).setEmoji('\u{1f44d}').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('suggestion_down').setLabel(String(down.length)).setEmoji('\u{1f44e}').setStyle(ButtonStyle.Danger),
          );
          await interaction.message.edit({ components: [row] });
          await interaction.deferUpdate();
          return;
        }
      } catch (e) { console.error(`Button ${id}:`, e); const r = { embeds: [new EmbedBuilder().setDescription('Error.').setColor(config.errorColor)], flags: 64 }; if (interaction.replied || interaction.deferred) await interaction.followUp(r).catch(()=>{}); else await interaction.reply(r).catch(()=>{}); }
      return;
    }
    if (interaction.isStringSelectMenu()) {
      try { if (interaction.customId === 'reactionrole_select') return await require('../systems/reactionRole').execute(interaction, client); } catch(e) { console.error(e); }
      return;
    }
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    const gc = db.prepare('SELECT * FROM guild_config WHERE guild_id = ?').get(interaction.guild?.id);
    if (gc) { const d = db.prepare('SELECT * FROM disabled_commands WHERE guild_id = ? AND command_name = ?').get(interaction.guild.id, command.data.name); if (d) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`\`${command.data.name}\` is disabled.`).setColor(config.errorColor)], flags: 64 }); }
    try { await command.execute(interaction, client); }
    catch (e) { console.error(`${command.data.name}:`, e); const r = { embeds: [new EmbedBuilder().setDescription('Error.').setColor(config.errorColor)], flags: 64 }; if (interaction.replied || interaction.deferred) await interaction.followUp(r).catch(()=>{}); else await interaction.reply(r).catch(()=>{}); }
  },
};
