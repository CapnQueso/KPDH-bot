const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rumi')
		.setDescription('rumi quote'),
	async execute(interaction) {
		await interaction.reply('rumi test');
	},
};
