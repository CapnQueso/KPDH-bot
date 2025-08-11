const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const { incrementCommandCount } = require('../../stats.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Shows the current stats from stats.txt'),

  async execute(interaction) {
    try {
      incrementCommandCount();
     
      const statsPath = path.join(__dirname, '..', '..', 'stats.txt');
      const statsData = fs.readFileSync(statsPath, 'utf8');
      await interaction.reply(`\`\`\`\n${statsData}\n\`\`\``);
    } catch (error) {
      console.error(error);
      await interaction.reply('Oops, couldn’t read stats.txt 😔');
    }
  },
};
