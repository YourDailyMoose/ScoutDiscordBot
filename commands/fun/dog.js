const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { botColours } = require('../../index.js');
const fetch = require('node-fetch');

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Get a random dog picture!'),
  async execute(interaction) {

    await interaction.deferReply();

    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();

      const embed = new EmbedBuilder()
        .setTitle(`Random Dog Picture`)
        .setImage(data.message)
        .setColor(botColours.primary)
        .setFooter({ text: `Fetched from dog.ceo | Requested by ${interaction.user.tag}`});

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.log(err);
    }
  },
};