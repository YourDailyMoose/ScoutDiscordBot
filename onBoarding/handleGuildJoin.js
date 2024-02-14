const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');

async function guildJoin(guild) {
    const guildId = guild.id;
    const result = await onInvite(guildId); // Use the updated onInvite function

    // Get the first text channel where the bot can send messages
    const firstChannel = guild.channels.cache
        .filter(c => c.type === ChannelType.GuildText && c.permissionsFor(guild.members.me).has('SendMessages'))
        .sort((a, b) => a.position - b.position)
        .first();

    if (!firstChannel) {
        console.log(`No suitable channel found to send a message in guild ${guildId}`);
        return;
    }

    if (result && result.found) {
        // Handle existing settings
        const embed = new EmbedBuilder()
            .setColor('Amber')
            .setTitle(`Existing Settings Found`)
            .setDescription(`Existing settings were found for this guild. Use or wipe them?`)
            .setTimestamp();

        const dataFoundOptions = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Use Existing Settings')
                    .setStyle('Primary')
                    .setCustomId('use_existing_data'),
                new ButtonBuilder()
                    .setLabel('Wipe Existing Settings')
                    .setStyle('Danger')
                    .setCustomId('wipe_existing_data')
            );

        await firstChannel.send({ embeds: [embed], components: [dataFoundOptions] });
    } else if (result === false) {
        // Handle new guild with no existing settings
        const newGuildEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`Welcome to Scout!`)
            .setDescription(`Thank you for inviting Scout to your server! To get started, please run the \`/setup\` command.`)
            .setTimestamp();

        await firstChannel.send({ embeds: [newGuildEmbed] });
    } else {
        // Handle errors (if any)
        console.error(`Error occurred while handling guild join for ${guildId}`);
    }
}

module.export = guildJoin;