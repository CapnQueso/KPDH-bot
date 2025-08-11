const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

function getCommandFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      files = files.concat(getCommandFiles(path.join(dir, entry.name)));
    } else if (entry.name.endsWith('.js')) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getCommandFiles(commandsPath);

const commands = [];

for (const file of commandFiles) {
  const command = require(file);
  if ('data' in command && 'execute' in command) {
    const json = command.data.toJSON();
    json.dm_permission = true; // allow in DMs
    commands.push(json);
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Register guild commands (super fast updates)
    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
      console.log('Successfully reloaded guild application (/) commands.');
    }

    // Register global commands (work everywhere including DMs, slower update)
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );
    console.log('Successfully reloaded global application (/) commands.');

  } catch (error) {
    console.error(error);
  }
})();
