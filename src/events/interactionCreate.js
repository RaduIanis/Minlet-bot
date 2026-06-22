const { Events, EmbedBuilder } = require('discord.js');
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
        if (id === 'giveaway_enter') return await interaction.reply({ embeds: [new EmbedBuilder().setDescription('React with 🎉 to enter!').setColor(config.infoColor)], flags: 64 });
        if (id === 'reactionrole_select') return await require('../systems/reactionRole').execute(interaction, client);
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
