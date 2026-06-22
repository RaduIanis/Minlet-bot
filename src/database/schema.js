const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const dbDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const db = new Database(path.join(dbDir, 'minlet.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
  CREATE TABLE IF NOT EXISTS guild_config (
    guild_id TEXT PRIMARY KEY,
    welcome_channel TEXT,
    welcome_message TEXT DEFAULT 'Welcome to the server, {user}!',
    farewell_channel TEXT,
    farewell_message TEXT DEFAULT '{user} has left the server.',
    autorole TEXT,
    log_channel TEXT,
    ticket_category TEXT,
    mute_role TEXT,
    level_channel TEXT,
    anti_spam INTEGER DEFAULT 0,
    anti_link INTEGER DEFAULT 0,
    anti_mass_mention INTEGER DEFAULT 0,
    max_links_per_msg INTEGER DEFAULT 3,
    max_mentions_per_msg INTEGER DEFAULT 5,
    reaction_roles TEXT DEFAULT '[]',
    suggestion_channel TEXT
  );
  CREATE TABLE IF NOT EXISTS warnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    reason TEXT DEFAULT 'No reason provided',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS invites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    inviter_id TEXT NOT NULL,
    code TEXT NOT NULL,
    uses INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS invite_uses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invite_id INTEGER NOT NULL,
    guild_id TEXT NOT NULL,
    inviter_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (invite_id) REFERENCES invites(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS member_stats (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    messages INTEGER DEFAULT 0,
    voice_time INTEGER DEFAULT 0,
    reactions_given INTEGER DEFAULT 0,
    reactions_received INTEGER DEFAULT 0,
    invites INTEGER DEFAULT 0,
    level INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    last_message TEXT,
    last_voice TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (guild_id, user_id)
  );
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    claimed_by TEXT,
    status TEXT DEFAULT 'open',
    category TEXT DEFAULT 'general',
    created_at TEXT DEFAULT (datetime('now')),
    closed_at TEXT,
    closed_by TEXT
  );
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    host_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    game_name TEXT NOT NULL,
    max_players INTEGER DEFAULT 4,
    current_players TEXT DEFAULT '[]',
    status TEXT DEFAULT 'waiting',
    description TEXT DEFAULT '',
    scheduled_time TEXT,
    message_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    started_at TEXT,
    ended_at TEXT
  );
  CREATE TABLE IF NOT EXISTS mutes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    reason TEXT DEFAULT 'No reason provided',
    duration TEXT,
    expires_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    active INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS level_rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    level INTEGER NOT NULL,
    role_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(guild_id, level)
  );
  CREATE TABLE IF NOT EXISTS disabled_commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    command_name TEXT NOT NULL,
    disabled_by TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(guild_id, command_name)
  );
  CREATE TABLE IF NOT EXISTS tag (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    uses INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(guild_id, name)
  );
  CREATE TABLE IF NOT EXISTS reminder (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    content TEXT NOT NULL,
    remind_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    message_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    upvotes TEXT DEFAULT '[]',
    downvotes TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);
module.exports = db;
