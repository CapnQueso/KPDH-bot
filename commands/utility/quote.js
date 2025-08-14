const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');
const readline = require('node:readline');
const path = require('node:path');
const { performance } = require('node:perf_hooks');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Search kpop.txt for quotes by text and optional speaker')
    .addStringOption(opt =>
      opt.setName('text').setDescription('Text to search for').setRequired(true))
    .addStringOption(opt =>
      opt.setName('speaker').setDescription('Name of the speaker (optional)')),

  async execute(interaction) {
    const startTime = performance.now();

    const textQuery = normalize(interaction.options.getString('text'));
    const speakerQuery = interaction.options.getString('speaker') ? normalize(interaction.options.getString('speaker')) : null;

    const filePath = path.join(__dirname, '..', '..', 'kpop.txt');
    if (!fs.existsSync(filePath)) {
      return interaction.reply({
        content: 'kpop.txt not found two directories up — file load busted.',
      });
    }

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    const lines = [];
    for await (const line of rl) {
      const sepIndex = line.indexOf(':');
      if (sepIndex < 0) continue;

      const speaker = line.slice(0, sepIndex).trim();
      const quote = line.slice(sepIndex + 1).trim();

      if (
        normalize(quote).includes(textQuery) &&
        (!speakerQuery || normalize(speaker) === speakerQuery)
      ) {
        lines.push(`**${speaker}**: ${quote}`);
      }
    }

    const endTime = performance.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(3);

    if (!lines.length) {
      return interaction.reply({
        content: `Found 0 result(s) for "${interaction.options.getString('text')}" in ${executionTime} seconds.`,
      });
    }

    const header = `Found ${lines.length} result(s) for "${interaction.options.getString('text')}" in ${executionTime} seconds:\n`;
    let preview = header;
    let truncated = false;

    for (const l of lines) {
      if (preview.length + l.length + 1 > 1990) {
        truncated = true;
        break;
      }
      preview += l + '\n';
    }

    if (truncated) {
      const fullText = header + lines.join('\n');
      const attachment = new AttachmentBuilder(Buffer.from(fullText, 'utf8'), { name: 'quotes.txt' });
      return interaction.reply({
        content: preview + `…and ${lines.length - (preview.split('\n').length - 1)} more. Full results attached.`,
        files: [attachment],
      });
    }

    return interaction.reply({
      content: preview,
    });
  },
};

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
