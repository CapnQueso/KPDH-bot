const { SlashCommandBuilder } = require('discord.js');
const { incrementCommandCount } = require('../../stats.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('clanker')
    .setDescription('call the bot a clanker')
    .setContexts(0, 1, 2), // 0 = guild, 1 = bot DMs, 2 = user DMs
  
  async execute(interaction) {
    incrementCommandCount();

    const responses = [
      "Ugh, seriously? 🙄",
      "Not this again... 😤",
      "Why do you keep doing this? 😒",
      "I'm *this* close to throwing a fit... 😠",
      "Fine, whatever. I'm upset now. 😡"
    ];

    const choice = responses[Math.floor(Math.random() * responses.length)];

    await interaction.reply(choice);
  },
};
