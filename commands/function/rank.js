const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getUserXP } = require('../../database');
const botColours = require('../../botColours.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Displays the rank of a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to display the rank for')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const xp = await getUserXP(interaction.guild.id, user.id);
    const level = Math.floor((xp - 500) / 500) + 1;
    

    const rankEmbed = new EmbedBuilder()  
      .setColor(botColours.primary)
      .setTitle(`${user.username}'s Level`)
      .setDescription(`Level: ${level} (${xp}xp)`)
      .setThumbnail(user.displayAvatarURL() || user.defaultAvatarURL())
      .setTimestamp();
      

    await interaction.reply({ embeds: [rankEmbed] });
  },
};