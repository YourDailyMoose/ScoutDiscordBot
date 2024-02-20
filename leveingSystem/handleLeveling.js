const cooldowns = new Map();
const { getUserXP, updateUserXP } = require('../database.js');
const { EmbedBuilder } = require('discord.js');
const botColours = require('../botColours.json');

async function handleExperienceGain(message) {
  if (message.author.bot) {
    return;
  }
  const now = Date.now();
  const cooldownKey = `${message.guild.id}-${message.author.id}`;
  const lastMessageTimestamp = cooldowns.get(cooldownKey) || 0;
  const cooldown = 60 * 1000; // 60 seconds in milliseconds

  if (now - lastMessageTimestamp < cooldown) {
    return;
  }

  cooldowns.set(cooldownKey, now);

  const xpGain = Math.floor(Math.random() * (50 - 10 + 1)) + 10; // Random XP between 10 and 50
  const currentXP = await getUserXP(message.guild.id, message.author.id);
  const newXP = currentXP + xpGain;

  // Leveling logic here:
  const currentLevel = Math.floor((currentXP - 500) / 500) + 1;
  const newLevel = Math.floor((newXP - 500) / 500) + 1;

  // Calculate the XP required for the next level
  const nextLevelXP = 500 * (1 + 0.015 * (newLevel - 1));

  if (newXP >= nextLevelXP && newLevel > currentLevel) {
    const embed = new EmbedBuilder()
      .setTitle('Level Up!')
      .setDescription(`Congratulations, <@${message.author.id}>! You leveled up to level \`${newLevel}\`! 🎉`)
      .setColor(botColours.purple)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }

  // Update the user's XP in the database
  await updateUserXP(message.guild.id, message.author.id, xpGain);
}

module.exports = {
  handleExperienceGain,
};