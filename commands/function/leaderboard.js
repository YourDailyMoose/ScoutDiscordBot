const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getGuildXpData } = require('../../database');
const botColours = require('../../botColours.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard for the server'),
    async execute(interaction) {
        const guildXpData = await getGuildXpData(interaction.guild.id);
        const levels = guildXpData.levels;
    
        const sortedLevels = Object.entries(levels).sort((a, b) => b[1] - a[1]);

        const itemsPerPage = 10;
        let page = 0;

        const embeds = [];
        for (let i = 0; i < sortedLevels.length; i += itemsPerPage) {
            const description = sortedLevels.slice(i, i + itemsPerPage).map((entry, index) => {
                const [userId, xp] = entry;
                const level = Math.floor((xp - 500) / 500) + 1;
                const user = interaction.guild.members.cache.get(userId);
                return `${i + index + 1}. ${user?.user.username || 'Unknown User'}: ${xp}xp (Level ${level})`;
            }).join('\n');

            const leaderboardEmbed = new EmbedBuilder()
                .setColor(botColours.primary)
                .setTitle(`Leaderboard for ${interaction.guild.name}`)
                .setDescription(description)
                .setFooter({ text: `Page ${i / itemsPerPage + 1}/${Math.ceil(sortedLevels.length / itemsPerPage)}`});

            embeds.push(leaderboardEmbed);
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Previous')
                    .setStyle('Primary')
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle('Primary')
                    .setDisabled(page === embeds.length - 1),
            );

        await interaction.reply({ embeds: [embeds[page]], components: [row] });

        const message = await interaction.fetchReply();
        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'previous') {
                if (page > 0) page--;
            } else if (interaction.customId === 'next') {
                if (page < embeds.length - 1) page++;
            }

            row.components[0].setDisabled(page === 0);
            row.components[1].setDisabled(page === embeds.length - 1);

            await interaction.update({ embeds: [embeds[page]], components: [row] });
        });

        collector.on('end', async () => {
            row.components.forEach(button => button.setDisabled(true));
            await message.edit({ components: [row] });
        });
    },
};