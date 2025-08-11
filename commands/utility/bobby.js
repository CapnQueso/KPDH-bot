const { SlashCommandBuilder } = require('discord.js');
const { incrementCommandCount } = require('../../stats.js');

const fs = require('fs').promises;
const path = require('path');

function formatHMS(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hDisplay = hrs > 0 ? `${hrs}:` : ''; // only show hours if >0
  const mDisplay = (hrs > 0 && mins < 10) ? `0${mins}:` : `${mins}:`; // pad mins if hrs shown
  const sDisplay = secs.toString().padStart(2, '0');

  return `${hDisplay}${mDisplay}${sDisplay}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bobby')
    .setDescription('Get a random Bobby quote from kpop.txt')
    .setContexts(0, 1, 2), // 0 = guild, 1 = bot DMs, 2 = user DMs

  async execute(interaction) {
    try {
      incrementCommandCount();

      const totalSeconds = 5076; // total duration of movie (animation part)

      // Read file as lines
      const filePath = path.join(__dirname, '../../kpop.txt'); 
      // Adjust the path if needed — this assumes kpop.txt is 2 folders up from 'utility' folder

      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      // Filter Bobby lines and store their indices
      const bobbyLines = lines
        .map((line, idx) => ({ line, idx }))
        .filter(obj => obj.line.startsWith('Bobby:'));

      if (bobbyLines.length === 0) {
        await interaction.reply('No Bobby quotes found in the transcript!');
        return;
      }

      // Pick a random quote
      const randomEntry = bobbyLines[Math.floor(Math.random() * bobbyLines.length)];

      // Calculate timestamp (in seconds) and format it
      const timestampSeconds = Math.floor((randomEntry.idx / lines.length) * totalSeconds);


      // Format timestamp mm:ss
      const timestampFormatted = formatHMS(timestampSeconds);


      // Clean quote text (remove "Bobby: " prefix)
      const quoteText = randomEntry.line.replace(/^Bobby:\s*/, '');

      // Reply with quote + timestamp
      await interaction.reply(`**Bobby:** "${quoteText}" Timestamp: ${timestampFormatted}`);

    } catch (error) {
      console.error(error);
      await interaction.reply('Oops, something went wrong fetching Bobby quotes.');
    }
  },
};
