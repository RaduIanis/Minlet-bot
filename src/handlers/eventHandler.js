const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  let total = 0;
  for (const file of fs.readdirSync(path.join(__dirname, '..', 'events')).filter((f) => f.endsWith('.js'))) {
    const event = require(path.join(__dirname, '..', 'events', file));
    if (event.name) {
      if (event.once) client.once(event.name, (...a) => event.execute(...a, client));
      else client.on(event.name, (...a) => event.execute(...a, client));
      total++;
    }
  }
  console.log(`[Minlet] Loaded ${total} events`);
};
