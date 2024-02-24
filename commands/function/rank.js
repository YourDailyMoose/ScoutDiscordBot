const { createCanvas, loadImage, registerFont } = require('canvas');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { getUserXP, getUserLevel, getUserGuildRank, getLevelXPRequirement } = require('../../database');

registerFont('Lexend-VariableFont_wght.ttf', { family: 'Lexend' });

async function createRankImage(user, xp, rank, level, nextLevelXp) {
  const canvas = createCanvas(934, 282);
  const ctx = canvas.getContext('2d');

  // Load and draw the background image
  const backgroundImage = await loadImage('rankBackground.png');
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Draw username
  ctx.font = '30px Lexend';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(user.username, 310, 50); // Increase x-coordinate

  // Draw XP

  ctx.fillText(`XP: ${xp} (Level ${level})`, 310, 100); // Increase x-coordinate

  // Draw rank
  ctx.fillText(`Rank: ${rank}`, 310, 150); // Increase x-coordinate

  // Draw progress bar background
  ctx.fillStyle = '#737373';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  let progressBarX = 310;
  let progressBarY = 200;
  let progressBarWidth = 500;
  let progressBarHeight = 30;
  let cornerRadius = 15; // Adjust as needed

  // Draw the background with rounded corners
  ctx.beginPath();
  ctx.moveTo(progressBarX + cornerRadius, progressBarY);
  ctx.lineTo(progressBarX + progressBarWidth - cornerRadius, progressBarY);
  ctx.arcTo(progressBarX + progressBarWidth, progressBarY, progressBarX + progressBarWidth, progressBarY + cornerRadius, cornerRadius);
  ctx.lineTo(progressBarX + progressBarWidth, progressBarY + progressBarHeight - cornerRadius);
  ctx.arcTo(progressBarX + progressBarWidth, progressBarY + progressBarHeight, progressBarX + progressBarWidth - cornerRadius, progressBarY + progressBarHeight, cornerRadius);
  ctx.lineTo(progressBarX + cornerRadius, progressBarY + progressBarHeight);
  ctx.arcTo(progressBarX, progressBarY + progressBarHeight, progressBarX, progressBarY + progressBarHeight - cornerRadius, cornerRadius);
  ctx.lineTo(progressBarX, progressBarY + cornerRadius);
  ctx.arcTo(progressBarX, progressBarY, progressBarX + cornerRadius, progressBarY, cornerRadius);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Save the current context state
  ctx.save();

  // Create a gradient for the progress fill
  let gradient = ctx.createLinearGradient(progressBarX, 0, progressBarX + progressBarWidth, 0);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(1, '#ffffff');

  // Clip the context to the rounded rectangle shape
  ctx.clip();

  // Draw progress bar fill with the gradient
  ctx.fillStyle = gradient;
  let progress = (xp / nextLevelXp) * progressBarWidth;
  ctx.fillRect(progressBarX, progressBarY, progress, progressBarHeight); // Fill the progress with the gradient

  // Restore the context before drawing the profile picture and border
  ctx.restore();

  // Draw XP text
  ctx.font = '25px Lexend';
  ctx.fillStyle = '#ffffff';
  let xpText = `Next Level in: ${Math.round(nextLevelXp) - xp}xp`;
  ctx.fillText(xpText, progressBarX + progressBarWidth - ctx.measureText(xpText).width, progressBarY + progressBarHeight + 30); // Position the text under the progress bar

  // Load and draw user avatar
  let avatarUrl = user.displayAvatarURL({ format: 'png', dynamic: false });
  avatarUrl = avatarUrl.substr(0, avatarUrl.lastIndexOf('.')) + '.png';
  const avatar = await loadImage(avatarUrl);

  // Create a circular clipping region
  ctx.beginPath();
  let radius = 120; // Decrease the radius to make the circle smaller
  ctx.arc(radius + 20, canvas.height / 2, radius, 0, Math.PI * 2, true); // Keep the same x and y coordinates
  ctx.closePath();
  ctx.clip();

  // Draw the avatar within the clipping region
  ctx.drawImage(avatar, 20, canvas.height / 2 - radius, radius * 2, radius * 2); // Adjust the size of the avatar

  // Draw a circular border
  ctx.beginPath();
  ctx.arc(radius + 20, canvas.height / 2, radius, 0, Math.PI * 2, true); // Keep the same x and y coordinates
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.stroke();


  return canvas.toBuffer();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Displays the rank of a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to display the rank for')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.member.user;
    const getxp = await getUserXP(interaction.guild.id, user.id);

    if (getxp === 0) {
      if (user.id === interaction.user.id) {
          await interaction.reply('You have no XP yet! Start chatting to earn XP.');
      } else {
          await interaction.reply(`${user.username} has no XP yet!`);
      }
      
      return;
    }
    const getlevel = await getUserLevel(interaction.guild.id, user.id);
    const getrank = await getUserGuildRank(interaction.guild.id, user.id);
    const getnextLevelXP = await getLevelXPRequirement(getlevel + 1);

    const rankImage = await createRankImage(user, getxp, getrank, getlevel, getnextLevelXP);

    const attachment = new AttachmentBuilder(rankImage, 'rank.png');

    await interaction.reply({ files: [attachment] });
  },
};
