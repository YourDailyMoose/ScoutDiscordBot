const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { botColours } = require('../../index.js');
const fetch = require('node-fetch');

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Get a random cat picture!'),
  async execute(interaction) {

    await interaction.deferReply();

    try {
      const response = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await response.json();

      const embed = new EmbedBuilder()
        .setTitle(`Random Cat Picture`)
        .setImage(data[0].url)
        .setColor(botColours.primary)
        .setFooter({ text: `Fetched from TheCatAPI | Requested by ${interaction.user.tag}` });

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.log(err);
    }
  },
};