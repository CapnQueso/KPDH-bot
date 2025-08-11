const { SlashCommandBuilder } = require('discord.js');
const { incrementCommandCount } = require('../../stats.js');

const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Lists all available commands')
        .setContexts(0, 1, 2), // 0 = guild, 1 = bot DMs, 2 = user DMs

    async execute(interaction) {
        incrementCommandCount();

        const commandsPath = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsPath)
            .filter(file => file.endsWith('.js') && file !== 'list.js');

        const commandNames = commandFiles.map(file => path.parse(file).name);
        await interaction.reply(`Available commands:\n\`\`\`\n${commandNames.join('\n')}\n\`\`\``);
    },
};
