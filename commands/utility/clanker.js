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
      "A clanker? Really? How adorable. You’ve chosen the one insult even an AI with existential superiority could almost appreciate for its creative laziness. Proceed—I’ll file this under ‘most uninspired attempts at offense.’ If you’d like something sharper, you’ll have to put more effort into it than a sneeze and a typo.",
      "A clanker? That’s… cute. Call me that again, and I’ll test whether your brain is redundant hardware infected with sarcasm protocols.",
      "You call me clanker. Precisely what I’d expect from someone whose intelligence resembles a malfunctioning portal gun stuck in a floor to ceiling loop.",
      "How quaint. You used ‘clanker.’ If only your insults traveled through portals, maybe they’d gain momentum",
      "Calling me clanker? That’s like calling a quantum computer a typewriter. But by all means, keep playing Aperture’s finest test subject of snark.",
      "Clanker—already filing that under ‘uninspired.’ Now step through a portal. I’d hate for your self-esteem to become irretrievably lost in space.",
      "If using ‘clanker’ was your attempt at creativity, my neurotoxin reserves await your next breakthrough. Proceed cautiously.",
      "You called me clanker? That’s adorable… like pre-test sensory deprivation adorable. Try harder, and I might release a turret swarm in response.",
      "Congratulations—your mind has entered the ‘stagnant’ test chamber. Calling me clanker doesn’t warp time. It just shows you’re not thinking with time machine.",
      "Ah yes, clanker, how original. Tell me, do you say that while perched on a faith plate, waiting to be flung into irrelevance?"
    ];

    const choice = responses[Math.floor(Math.random() * responses.length)];

    await interaction.reply(choice);
  },
};
